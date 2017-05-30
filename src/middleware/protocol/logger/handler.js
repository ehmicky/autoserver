'use strict';


const { log } = require('../../../utilities');
const { getReason } = require('../../../error');
const { infoSym } = require('../../../logging');
const { getLeanLogInfo } = require('./lean');


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
// Need to decide about what goes in rawMessage
// Try to vertically align
// What happens if logger throw exception?

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

      handleLog(logInfo, error);

      throw error;
    }
  };
};

const handleLog = function (logInfo, error) {
  const info = logInfo[infoSym];

  if (error) {
    info.error = getReason({ error });
  }

  info.lean = getLeanLogInfo(info);

  info.rawMessage = getRawMessage(info);

  logRequest(info);
};

const getRawMessage = function ({
  timestamp,
  protocolFullName,
  protocolMethod,
  method,
  path,
  route,
  ip,
  params,
}) {
  timestamp = `[${timestamp}]`;
  params = JSON.stringify(params);
  const rawMessage = [
    timestamp,
    protocolFullName,
    protocolMethod,
    method,
    path,
    route,
    ip,
    params,
  ].join(' ');
  return rawMessage;
};

const logRequest = function (logInfo) {
  console.log(JSON.stringify(logInfo.lean, null, 2));
  return;
  const { message, rawMessage } = logInfo;
  log.log(message);
};


module.exports = {
  logger,
};
