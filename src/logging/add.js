'use strict';

const { deepMerge, omit } = require('../utilities');

// Represents a logger
// Can:
//  - createLog({ serverOpts, apiServer, phase }) - returns new `log`
//  - reportLog({ log, level, message, info }) - sends some log
//  - addLog(obj, info) - add requestInfo information.
//    Returns new `obj`, storing info at `obj.log`,
//    i.e. does not modify original `obj`
const createLog = function ({ serverOpts, apiServer, phase }) {
  const logInfo = {};
  const log = { serverOpts, apiServer, phase, logInfo };
  return log;
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
