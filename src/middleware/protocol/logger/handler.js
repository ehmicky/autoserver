'use strict';


const { log } = require('../../../utilities');
const { getReason } = require('../../../error');
const { infoSym } = require('../../../logging');
const { getRequestInfo } = require('./request_info');
const { getMessage } = require('./message');


// logInfo:
//   - requestId
//   - timestamp
//   - ip
//   - protocol
//   - protocolFullName
//   - url
//   - path
//   - route
//   - protocolMethod
//   - method
//   - status
//   - protocolStatus
//   - params
//   - queryVars
//   - pathVars
//   - headers
//   - payload
//   - protocolArgs
//   - interface
//   - actions:
//      - ACTION_PATH:
//          - model
//          - args (original)
//          - responses OBJ_ARR:
//             - content
//   - response (the one that was sent): content, type
//   - error reason
// logInfo.lean: shortened version (see `lean.js` for more info)

// Main request logging middleware.
// Each request creates exactly one log, whether successful or not,
// unless it crashed very early (i.e. before this middleware), in which case
// it will still be handled by the error logging middleware.

// TODO: explanation comments here
const logger = function () {
  return async function httpLogger(input) {
    const { logInfo } = input;

    try {
      const response = await this.next(input);

      handleLog(logInfo);

      return response;
    } catch (error) {
      if (!(error instanceof Error)) {
        error = new Error(String(error));
      }

      const errorReason = getReason({ error });
      logInfo.add({ errorReason });
      handleLog(logInfo, error);

      throw error;
    }
  };
};

const handleLog = function (logInfo) {
  const info = logInfo[infoSym];
  const requestInfo = getRequestInfo(info);

  log.log(requestInfo);
};


module.exports = {
  logger,
};
