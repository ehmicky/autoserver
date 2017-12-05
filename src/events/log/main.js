'use strict';

const { throwError } = require('../../error');
const { getVars, reduceVars } = require('../../schema_func');
const { LEVELS } = require('../constants');

const { consolePrint } = require('./console');
const { loggers, DEFAULT_LOGGER } = require('./merger');

const reportLog = function ({ schema, mInput, vars, duration }) {
  const noLog = !shouldLog({ schema, vars });
  if (noLog) { return; }

  const varsA = getVars(mInput, { vars });
  const varsB = reduceVars({ vars: varsA });

  consolePrint({ vars: varsB, duration });

  return fireLogger({ schema, vars: varsB });
};

// Can filter verbosity with `schema.log.level`
// This won't work for very early startup errors since `schema` is not
// parsed yet.
const shouldLog = function ({ schema: { log = {} }, vars: { level, type } }) {
  return log.level !== 'silent' &&
    LEVELS.indexOf(level) >= LEVELS.indexOf(log.level) &&
    type !== 'perf';
};

const fireLogger = function ({
  schema: { log: { provider, opts = {} } = {} },
  vars,
}) {
  const { report } = getLogger({ provider });
  return report(vars, opts);
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
