'use strict';

const { merge } = require('lodash');

const { pick } = require('../utilities');
const { rethrowError } = require('../error');

// Add log information to `obj.log`
// Returns a new copy, i.e. does not modify original `obj`
const addLogInfo = function (obj, newLog) {
  // We directly mutate `input.log` because it greatly simplifies the code.
  merge(obj.log, newLog);
  return obj;
};

// Some log should only be added when an exception is thrown
// E.g. the current `action` or `model`
const addLogIfError = function (func, props) {
  return async (nextFunc, input, ...args) => {
    try {
      return await func(nextFunc, input, ...args);
    } catch (error) {
      const newLog = pick(input, props);
      addLogInfo(input, newLog);

      rethrowError(error);
    }
  };
};

module.exports = {
  addLogInfo,
  addLogIfError,
};
