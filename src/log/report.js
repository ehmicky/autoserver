'use strict';

const { throwError } = require('../error');
const { getVars, reduceVars } = require('../functions');

const { LEVELS } = require('./constants');
const { consolePrint } = require('./console');
const { loggers, DEFAULT_LOGGER } = require('./merger');

// Report to console, then use `schema.log` for reporting
const reportLog = function ({
  schema,
  mInput = { schema },
  vars,
  vars: { event },
}) {
  const noLog = !shouldLog({ schema, vars });
  if (noLog) { return; }

  const varsA = getVars(mInput, { vars });
  const log = reduceVars({ vars: varsA });

  // Performance events are handled differently
  const isPerf = event === 'perf';

  consolePrint({ vars: log, isPerf });

  return fireLoggers({ schema, mInput, vars, log, isPerf });
};

// Can filter verbosity with `schema.log.level`
// This won't work for very early startup errors since `schema` is not
// parsed yet.
const shouldLog = function ({ schema: { log }, vars: { level } }) {
  // Also check that at least one logger is used
  return log &&
    log.level !== 'silent' &&
    LEVELS.indexOf(level) >= LEVELS.indexOf(log.level);
};

// Can fire several loggers at the same time
const fireLoggers = function ({ schema: { log: logConf }, ...rest }) {
  if (!Array.isArray(logConf)) {
    return fireLogger({ ...rest, logConf });
  }

  const promises = logConf.map(conf => fireLogger({ ...rest, logConf: conf }));
  return Promise.all(promises);
};

const fireLogger = function ({
  logConf: { provider, opts = {} },
  mInput,
  vars,
  vars: { measures, measuresmessage },
  log,
  isPerf,
}) {
  const { reportPerf, report } = getLogger({ provider });
  const reportFunc = isPerf ? reportPerf : report;

  if (reportFunc === undefined) { return; }

  return reportFunc({ log, measures, measuresmessage, mInput, vars, opts });
};

const getLogger = function ({ provider = DEFAULT_LOGGER.name }) {
  const logger = loggers[provider];
  if (logger !== undefined) { return logger; }

  const message = `Log provider '${provider}' does not exist`;
  throwError(message, { reason: 'SCHEMA_VALIDATION' });
};

module.exports = {
  reportLog,
};
