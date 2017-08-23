'use strict';

// Add request-related events information to `obj.reqInfo`
// Returns a new copy, i.e. does not modify original `obj`
const addReqInfo = function (obj, reqInfo) {
  const reqInfoA = { ...obj.reqInfo, ...reqInfo };
  return { ...obj, reqInfo: reqInfoA };
};

module.exports = {
  addReqInfo,
};
