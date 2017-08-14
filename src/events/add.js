'use strict';

const { deepMerge, omit } = require('../utilities');

// Add log information to `obj.log`
// Returns a new copy, i.e. does not modify original `obj`
const addLogInfo = function (obj, logInfo) {
  const { log: { logInfo: logInfoA } } = obj;
  const logInfoB = deepMerge(logInfoA, logInfo);
  obj.log.logInfo = logInfoB;
  return obj;
};

const removeLogInfo = function (obj, attributes) {
  const { log: { logInfo: logInfoA } } = obj;
  const logInfoB = omit(logInfoA, attributes);
  obj.log.logInfo = logInfoB;
  return obj;
};

module.exports = {
  addLogInfo,
  removeLogInfo,
};
