'use strict';

const { getVars, reduceVars } = require('../schema_func');

const { LEVELS } = require('./constants');
const { consolePrint } = require('./console');

const logEvent = function ({ runOpts, mInput, vars, duration }) {
  const noLog = !shouldLog({ runOpts, vars });
  if (noLog) { return; }

  const varsA = getVars(mInput, { vars });
  const varsB = reduceVars({ vars: varsA });

  consolePrint({ vars: varsB, duration });
};

// Can filter verbosity with `run` option `level`
// This won't work for very early startup errors since `runOpts` is not
// parsed yet.
const shouldLog = function ({ runOpts, vars: { level, type } }) {
  return runOpts.level !== 'silent' &&
    LEVELS.indexOf(level) >= LEVELS.indexOf(runOpts.level) &&
    type !== 'perf';
};

module.exports = {
  logEvent,
};
