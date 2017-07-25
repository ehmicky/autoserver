'use strict';

const { throwError } = require('../error');

// Enforces that a function is only called once
const onlyOnce = function (func, { error = false } = {}) {
  return (...args) => {
    if (func.called) {
      if (error) {
        throwError('This function can only be called once');
      }

      return;
    }

    func.called = true;
    return func(...args);
  };
};

module.exports = {
  onlyOnce,
};
