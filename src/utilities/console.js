'use strict';

const levels = [
  'debug',
  'info',
  'log',
  'warn',
  'error',
];

const createWrapper = (wrapper, level) => (...args) => {
  return console[level](...args);
};

const logWrapper = levels.reduce((wrapper, level) => {
  wrapper[level] = createWrapper(wrapper, level);
  return wrapper;
}, {});

module.exports = logWrapper;