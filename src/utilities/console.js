'use strict';


const levels = [
  'debug',
  'info',
  'log',
  'warn',
  'error',
];

// Since we are setting members dynamically, consumers must not rely on references to logger.* functions (they can change)
// but on reference to logger instead
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
  log: logger,
  setLogger,
};
