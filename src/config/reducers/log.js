'use strict';

const { throwError, addGenErrorHandler } = require('../../errors');
const { logAdapters, DEFAULT_LOGGER } = require('../../log');

// Normalize `log`
const normalizeLog = function ({ config: { log } }) {
  const logA = Array.isArray(log) ? log : [log];
  const logC = logA.map(logB => addDefaultProviderName({ log: logB }));
  const logD = addDefaultProvider({ log: logC });

  logD.forEach(validateProvider);

  const logE = logD.map(eNormalizeProvider);

  return { log: logE };
};

const addDefaultProviderName = function ({ log, log: { provider } }) {
  if (provider !== undefined) { return log; }

  return { ...log, provider: DEFAULT_LOGGER.name };
};

// Default log provider is always available, but can be turned `silent` with
// `log.level`
const addDefaultProvider = function ({ log }) {
  const hasConsole = log
    .some(({ provider }) => provider === DEFAULT_LOGGER.name);
  if (hasConsole) { return log; }

  return [...log, { provider: DEFAULT_LOGGER.name }];
};

const validateProvider = function ({ provider }) {
  const logAdapter = logAdapters[provider];
  if (logAdapter !== undefined) { return; }

  const message = `Log provider '${provider}' does not exist`;
  throwError(message, { reason: 'CONFIG_VALIDATION' });
};

const normalizeProvider = function (log) {
  const { provider, opts } = log;
  const { getOpts } = logAdapters[provider];
  if (getOpts === undefined) { return log; }

  const optsA = getOpts({ opts });
  return { ...log, opts: { ...opts, ...optsA } };
};

const eNormalizeProvider = addGenErrorHandler(normalizeProvider, {
  message: ({ provider }) => `Wrong configuration at 'log.${provider}.opts'`,
  reason: 'CONFIG_VALIDATION',
});

module.exports = {
  normalizeLog,
};
