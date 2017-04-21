'use strict';


const levels = [
  'debug',
  'info',
  'log',
  'warn',
  'error',
];

const logger = {};
const setLogger = ({ logger: newLogger = defaultLogger } = {}) => {
  levels.forEach(level => {
    logger[level] = newLogger(level);
  });
};

// Do not create a new function, so we do not pollute the stack trace
const defaultLogger = level => global.console[level].bind(global.console);

// By default, uses console, but can be redefined
setLogger();


module.exports = {
  console: logger,
  setLogger,
};
