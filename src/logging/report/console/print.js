'use strict';

const { NO_CONSOLE_TYPES, LEVELS } = require('../../constants');

const { colorize } = require('./colorize');

// Prints logs messages to console.
const consolePrint = function ({ type, level, message, loggerLevel }) {
  const noConsole = NO_CONSOLE_TYPES.includes(type) ||
    // Can filter verbosity with server option `loggerLevel`
    loggerLevel === 'silent' ||
    LEVELS.indexOf(level) < LEVELS.indexOf(loggerLevel);
  if (noConsole) { return; }

  const colorMessage = colorize({ type, level, message });

  // eslint-disable-next-line no-console, no-restricted-globals
  console[level](colorMessage);
};

module.exports = {
  consolePrint,
};
