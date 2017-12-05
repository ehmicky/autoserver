'use strict';

// Add log-specific schema variables
const addLogVars = function ({ vars, event, phase, level, message }) {
  const levelA = getLevel({ level, event });

  const varsA = { ...vars, event, phase, level: levelA, message };
  return varsA;
};

// Level defaults to `error` for event `failure`, and to `log` for other events
const getLevel = function ({ level, event }) {
  if (level) { return level; }

  if (event === 'failure') { return 'error'; }

  return 'log';
};

module.exports = {
  addLogVars,
};
