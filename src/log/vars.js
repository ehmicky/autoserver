'use strict';

// Add event-specific schema variables
const addEventVars = function ({ vars, type, phase, level, message }) {
  const levelA = getLevel({ level, type });

  const varsA = { ...vars, type, phase, level: levelA, message };
  return varsA;
};

// Level defaults to `error` for type `failure`, and to `log` for other types
const getLevel = function ({ level, type }) {
  if (level) { return level; }

  if (type === 'failure') { return 'error'; }

  return 'log';
};

module.exports = {
  addEventVars,
};
