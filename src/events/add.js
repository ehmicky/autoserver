'use strict';

const { merge } = require('lodash');

const { pick } = require('../utilities');
const { rethrowError } = require('../error');

// Add request-related events information to `obj.reqInfo`
// Returns a new copy, i.e. does not modify original `obj`
const addReqInfo = function (obj, newReqInfo) {
  // We directly mutate `input.reqInfo` because it greatly simplifies the code.
  merge(obj.reqInfo, newReqInfo);
  return obj;
};

// Some reqInfo should only be added when an exception is thrown
// E.g. the current `action` or `model`
const addReqInfoIfError = function (func, props) {
  return async (nextFunc, input, ...args) => {
    try {
      return await func(nextFunc, input, ...args);
    } catch (error) {
      const newReqInfo = pick(input, props);
      addReqInfo(input, newReqInfo);

      rethrowError(error);
    }
  };
};

module.exports = {
  addReqInfo,
  addReqInfoIfError,
};
