'use strict';


const { log } = require('../../../utilities');
const logInfo = require('./log_info');


const logger = function () {
  return async function httpLogger(input) {
    //const getLogInfo = logInfo[input.protocol].bind(null, input);
    try {
      const response = await this.next(input);

      //const info = getLogInfo(response);
      const fullLogData = getFullLogData({ input, response });
      const logData = getLogData(fullLogData);
      const rawMessage = getRawMessage(logData);
      const message = colorize(rawMessage);
      Object.assign(fullLogData, { logData, rawMessage, message });

      logRequest(fullLogData);

      return response;
    } catch (error) {
      if (!(error instanceof Error)) {
        error = new Error(String(error));
      }

      // Handler to send response error
      //error.getLogInfo = getLogInfo;

      throw error;
    }
  };
};

const getFullLogData = function ({
  input: {
    timestamp,
    protocol,
    protocolFullName,
    protocolMethod,
    method,
    url,
    path,
    route,
    ip,
    params,
  },
  response,
}) {
  return {
    timestamp,
    protocol,
    protocolFullName,
    protocolMethod,
    method,
    url,
    path,
    route,
    ip,
    params,
  };
};

const getLogData = function ({
  timestamp,
  protocol,
  protocolFullName,
  protocolMethod,
  method,
  url,
  path,
  route,
  ip,
  params,
}) {
  return {
    timestamp,
    protocol,
    protocolFullName,
    protocolMethod,
    method,
    url,
    path,
    route,
    ip,
    params,
  };
};

// fullLogData:
//   - request UUID/v4, also available in response headers sent
//     (including on errors), and in JSL param
//   - timestamp
//   - ip
//   - protocol
//   - protocolFullName
//   - requestUrl
//   - path
//   - route
//   - protocolMethod
//   - method
//   - protocolInfo:
//      - protocol specific info, e.g. HTTP status code
//      - each protocol gives its own protocolInfo as fullLogData, logData,
//        message, level
//   - params
//   - queryVars
//   - pathVars
//   - headers
//   - payload
//   - protocolArgs
//   - interface
//   - each action: fullPath, path, model name, original args, count
//   - each action response: content, type, page size (0 if none)
//   - full response (the one that was sent): content, type
//   - error object (the one that is logged, not the error response)
// logData:
//   - shortened version, available under fullLogData.shortened
//   - differences:
//      - params: keys only
//      - queryVars: keys only
//      - headers: keys only
//      - payload: length only
//      - each action: args.data -> args.data.length
//      - each action response: content -> content.length
//      - full response: content -> content.length
//      - error -> error.type
// Any of that useful in error response? Merge with error handling?
// Use log.add()?
// Need to decide about what goes in rawMessage
// Try to vertically align

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

const colorize = function (rawMessage) {
  const message = rawMessage;
  return message;
};

const logRequest = function (fullLogData) {
  const { message, rawMessage } = fullLogData;
  log.log(message);
};


module.exports = {
  logger,
};
