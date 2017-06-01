'use strict';


const { LEVELS } = require('./constants');


const consolePrint = function ({ type, level, message, loggerLevel }) {
  const noConsolePrint = noConsoleTypes.includes(type) ||
    loggerLevel === 'silent' ||
    LEVELS.indexOf(level) < LEVELS.indexOf(loggerLevel);
  if (noConsolePrint) { return; }

  global.console[level](message);
};
const noConsoleTypes = [];


module.exports = {
  consolePrint,
};
