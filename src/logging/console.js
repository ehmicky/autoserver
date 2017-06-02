'use strict';


const { LEVELS } = require('./constants');


// Prints logs messages to console.
const consolePrint = function ({ type, level, message, loggerLevel }) {
  // Can filter verbosity with server option `loggerLevel`
  const noConsolePrint = noConsoleTypes.includes(type) ||
    loggerLevel === 'silent' ||
    LEVELS.indexOf(level) < LEVELS.indexOf(loggerLevel);
  if (noConsolePrint) { return; }

  global.console[level](message);
};

// Those log types never prints to console
const noConsoleTypes = [];


module.exports = {
  consolePrint,
};
