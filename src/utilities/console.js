'use strict';

const levels = [
  'debug',
  'info',
  'log',
  'warn',
  'error',
];

const createWrapper = (wrapper, level) => (...args) => {
  return global.console[level](...args);
};

const consoleWrapper = levels.reduce((wrapper, level) => {
  wrapper[level] = createWrapper(wrapper, level);
  return wrapper;
}, {});

module.exports = {
  console: consoleWrapper,
};