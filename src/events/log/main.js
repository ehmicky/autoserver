'use strict';

const { getVars, reduceVars } = require('../../schema_func');
const { LEVELS } = require('../constants');

const { consolePrint } = require('./console');

const reportLog = function ({ schema, mInput, vars, duration }) {
  const noLog = !shouldLog({ schema, vars });
  if (noLog) { return; }

  const varsA = getVars(mInput, { vars });
  const varsB = reduceVars({ vars: varsA });

  consolePrint({ vars: varsB, duration });
};

// Can filter verbosity with `schema.log.level`
// This won't work for very early startup errors since `schema` is not
// parsed yet.
const shouldLog = function ({ schema: { log = {} }, vars: { level, type } }) {
  return log.level !== 'silent' &&
    LEVELS.indexOf(level) >= LEVELS.indexOf(log.level) &&
    type !== 'perf';
};

module.exports = {
  reportLog,
};
