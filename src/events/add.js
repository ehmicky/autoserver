'use strict';

const { deepMerge, pick } = require('../utilities');
const { rethrowError } = require('../error');

// Add log information to `obj.log`
// Returns a new copy, i.e. does not modify original `obj`
const addLogInfo = function (obj, logInfo) {
  const { log: { logInfo: logInfoA } } = obj;
  const logInfoB = deepMerge(logInfoA, logInfo);
  obj.log.logInfo = logInfoB;
  return obj;
};

// Some logInfo should only be added when an exception is thrown
// E.g. the current `action` or `model`
const addLogIfError = function (func, props) {
  return async (nextFunc, input, ...args) => {
    try {
      return await func(nextFunc, input, ...args);
    } catch (error) {
      const logInfo = pick(input, props);
      addLogInfo(input, logInfo);

      rethrowError(error);
    }
  };
};

module.exports = {
  addLogInfo,
  addLogIfError,
};
