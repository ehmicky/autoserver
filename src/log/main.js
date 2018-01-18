'use strict';

const { addErrorHandler, normalizeError, rethrowError } = require('../errors');

const { getLogParams } = require('./params');
const { LEVELS, DEFAULT_LOGGER } = require('./constants');
const { getLog } = require('./get');

// Log some event, including printing to console
// `config.log` might be `undefined` if the error happened at startup time.
const logEvent = async function ({
  config,
  config: { log: logConf = [DEFAULT_LOGGER] },
  ...rest
}) {
  const { log, configFuncInput } = getLogParams({ config, ...rest });

  // Can fire several logAdapters at the same time
  const promises = logConf
    .map(logConfA => fireLogger({ logConf: logConfA, log, configFuncInput }));
  // We make sure this function returns `undefined`
  await Promise.all(promises);
};

const fireLogger = function ({
  logConf: { provider, opts = {}, level },
  log,
  log: { event },
  configFuncInput,
}) {
  const noLog = !shouldLog({ level, log });
  if (noLog) { return; }

  const reportFunc = getReportFunc({ event, provider });
  if (reportFunc === undefined) { return; }

  return reportFunc({ log, opts, configFuncInput });
};

// Can filter verbosity with `config.log.level`
// This won't work for very early startup errors since config is not
// parsed yet.
const shouldLog = function ({ level, log }) {
  return level !== 'silent' &&
    LEVELS.indexOf(log.level) >= LEVELS.indexOf(level);
};

const getReportFunc = function ({ event, provider }) {
  // `perf` events are handled differently
  const funcName = event === 'perf' ? 'reportPerf' : 'report';
  const logProvider = getLog(provider);
  const reportFunc = logProvider[funcName];
  return reportFunc;
};

const logEventHandler = function (error, { config, event }) {
  const errorA = normalizeError({ error, reason: 'LOG' });
  const params = { error: errorA };
  // Give up if error handler fails
  // I.e. we do not need to `await` this
  silentLogEvent({ event: 'failure', phase: 'process', config, params });

  // Failure events are at the top of code stacks. They should not throw.
  if (event === 'failure') { return; }

  rethrowError(error);
};

const eLogEvent = addErrorHandler(logEvent, logEventHandler);

// This means there is a bug in the logging code itself
const lastResortHandler = function (error) {
  const errorA = normalizeError({ error, reason: 'LOG' });
  // eslint-disable-next-line no-console, no-restricted-globals
  console.error(errorA);
};

const silentLogEvent = addErrorHandler(logEvent, lastResortHandler);

module.exports = {
  logEvent: eLogEvent,
};
