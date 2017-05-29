'use strict';


// Retrieves protocol-specific logging info
const httpLogInfo = function (input) {
  const { specific: { status } } = input;
  return { status };
};


module.exports = {
  http: {
    logInfo: httpLogInfo,
  },
};
