'use strict';

const { throwError } = require('../../../error');
const { loggers, DEFAULT_LOGGER } = require('../../../log');

// Normalize `log`
const normalizeLog = function ({ schema, schema: { log } }) {
  const logA = Array.isArray(log) ? log : [log];
  const logC = logA.map(logB => addDefaultProviderName({ log: logB }));
  const logD = addDefaultProvider({ log: logC });

  logD.forEach(validateProvider);

  return { ...schema, log: logD };
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
  const logger = loggers[provider];
  if (logger !== undefined) { return; }

  const message = `Log provider '${provider}' does not exist`;
  throwError(message, { reason: 'SCHEMA_VALIDATION' });
};

module.exports = {
  normalizeLog,
};
