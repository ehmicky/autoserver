'use strict';

const { throwError } = require('../error');

// Enforces that a function is only called once
const onlyOnce = function (func, { error = false } = {}) {
  // eslint-disable-next-line fp/no-let
  let called = false;

  return (...args) => {
    if (called) {
      if (error) {
        throwError('This function can only be called once');
      }

      return;
    }

    // eslint-disable-next-line fp/no-mutation
    called = true;
    return func(...args);
  };
};

module.exports = {
  onlyOnce,
};
