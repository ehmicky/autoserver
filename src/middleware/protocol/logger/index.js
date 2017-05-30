'use strict';


const { log } = require('../../../utilities');


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

      const reason = error.reason || 'UNKNOWN';
      logInfo.add({ error: reason });
      handleLog(logInfo, error);

      throw error;
    }
  };
};

const handleLog = function (logInfo) {
  const info = logInfo.get();

  const leanLogInfo = getLeanLogInfo(info);
  const rawMessage = getRawMessage(info);
  Object.assign(info, { lean: leanLogInfo, rawMessage });

  logRequest(info);
};

const getLeanLogInfo = function (logInfo) {
  return Object.assign({}, logInfo);
};

// logInfo:
//   - requestId UUID/v4, also available in response headers sent
//     (including on errors), and in JSL param
//   + timestamp
//   + ip
//   + protocol
//   + protocolFullName
//   + url
//   + path
//   + route
//   + protocolMethod
//   + method
//   - protocolInfo:
//      - no more protocol-specific info. Only status
//      - protocol specific info, e.g. HTTP status code
//      - each protocol gives its own protocolInfo as fullLogData, logData,
//        message, level
//   + params
//   + queryVars
//   + pathVars
//   + headers
//   + payload
//   + protocolArgs
//   + interface
//   + actions:
//      - ACTION_PATH:
//          - model
//          - args (original)
//          - responses OBJ_ARR:
//             - content
//             - pageSize (null if none)
//   + full successful response (the one that was sent): content, type
//   - error reason
// logInfo.lean:
//   - shortened version, i.e.:
//      - params: keys only
//      - queryVars: keys only
//      - headers: keys only
//      - payload: length only
//      - each action: args.data -> args.data.length
//      - each action response: content -> content.length
//      - full response: content -> content.length
// Add to error response:
//   - requestId
//   - protocolMethod
// Pass log object:
//   - error handlers augment it, instead of modifying exception
//   - main error_handler take it and convert it to error object
//     Then error object is converted to error response by error transformers
//   - merged with error handling
// Need to decide about what goes in rawMessage
// Try to vertically align
// What happens if logger throw exception?

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
  console.log(JSON.stringify(logInfo, null, 2));
  return;
  const { message, rawMessage } = logInfo;
  log.log(message);
};


module.exports = {
  logger,
};
