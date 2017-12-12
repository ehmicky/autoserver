'use strict';

const { getVars, reduceVars } = require('../functions');

// Get log-specific config variables
const getLogVars = function ({
  vars,
  config,
  mInput = { config },
  event,
  phase,
  level,
  message,
}) {
  const levelA = getLevel({ level, event });

  const varsA = { ...vars, event, phase, level: levelA, message };
  const varsB = getVars(mInput, { vars: varsA });
  const log = reduceVars({ vars: varsB });

  // Used with `runConfigFunc()` by log providers
  const configFuncInput = { vars: { ...varsA, log }, mInput };

  return { log, configFuncInput };
};

// Level defaults to `error` for event `failure`, and to `log` for other events
const getLevel = function ({ level, event }) {
  if (level) { return level; }

  if (event === 'failure') { return 'error'; }

  return 'log';
};

module.exports = {
  getLogVars,
};
