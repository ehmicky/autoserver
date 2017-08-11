'use strict';

const { deepMerge, omit } = require('../utilities');

// Represents a logger
// Can:
//  - createLog() - returns new `log`
//  - reportLog(...) - sends some log
//  - addLogInfo(obj, info) - add requestInfo information.
//    Returns new `obj`, storing info at `obj.log`,
//    i.e. does not modify original `obj`
const createLog = function () {
  return { logInfo: {} };
};

// Add log information to `obj.log`
// Returns a new copy, i.e. does not modify original `obj`
const addLogInfo = function (obj, logInfo) {
  const { log, log: { logInfo: logInfoA } } = obj;
  const logInfoB = deepMerge(logInfoA, logInfo);
  return { ...obj, log: { ...log, logInfo: logInfoB } };
};

const removeLogInfo = function (obj, attributes) {
  const { log, log: { logInfo: logInfoA } } = obj;
  const logInfoB = omit(logInfoA, attributes);
  return { ...obj, log: { ...log, logInfo: logInfoB } };
};

module.exports = {
  createLog,
  addLogInfo,
  removeLogInfo,
};
