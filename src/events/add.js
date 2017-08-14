'use strict';

const { deepMerge, omit } = require('../utilities');

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
  addLogInfo,
  removeLogInfo,
};
