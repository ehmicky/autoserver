'use strict';

const { throwError } = require('../../error');
const { getVars, reduceVars } = require('../../schema_func');
const { LEVELS } = require('../constants');

const { consolePrint } = require('./console');
const { loggers, DEFAULT_LOGGER } = require('./merger');

const reportLog = function ({
  schema,
  mInput,
  vars,
  vars: { type },
  duration,
}) {
  const noLog = !shouldLog({ schema, vars });
  if (noLog) { return; }

  const varsA = getVars(mInput, { vars });
  const logInfo = reduceVars({ vars: varsA });

  const isPerf = type === 'perf';

  consolePrint({ vars: logInfo, duration, isPerf });

  return fireLogger({ schema, mInput, vars, logInfo, isPerf });
};

// Can filter verbosity with `schema.log.level`
// This won't work for very early startup errors since `schema` is not
// parsed yet.
const shouldLog = function ({ schema: { log = {} }, vars: { level } }) {
  return log.level !== 'silent' &&
    LEVELS.indexOf(level) >= LEVELS.indexOf(log.level);
};

const fireLogger = function ({
  schema: { log: { provider, opts = {} } = {} },
  mInput,
  vars,
  vars: { measures, measuresmessage },
  logInfo,
  isPerf,
}) {
  const logger = getLogger({ provider });
  const reportFunc = isPerf ? logger.reportPerf : logger.report;

  if (reportFunc === undefined) { return; }

  return reportFunc({ logInfo, measures, measuresmessage, mInput, vars, opts });
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
