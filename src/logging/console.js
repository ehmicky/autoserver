'use strict';

const { LEVELS } = require('./constants');

// Prints logs messages to console.
const consolePrint = function ({ level, message, loggerLevel }) {
  // Can filter verbosity with server option `loggerLevel`
  const noConsolePrint = loggerLevel === 'silent' ||
    LEVELS.indexOf(level) < LEVELS.indexOf(loggerLevel);
  if (noConsolePrint) { return; }

  // eslint-disable-next-line no-console, no-restricted-globals
  console[level](message);
};

module.exports = {
  consolePrint,
};
