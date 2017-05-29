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
    requestUrl,
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
    requestUrl,
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
  requestUrl,
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
    requestUrl,
    path,
    route,
    ip,
    params,
  };
};

// To have in fullLogData:
//   - timestamp
//   - protocol
//   - protocolFullName
//   - protocolMethod
//   - method
//   - requestUrl
//   - path
//   - route
//   - ip
//   - params
//   - protocolInfo, i.e. protocol specific info, e.g. HTTP status code
//   - error response
//   - request UUID/v4, also available in response|error sent, and in JSL param
//   - queryVars
//   - pathVars
//   - headers
//   - payload
//   - interface
//   - response type
//   - response content
//   - response content length
//   - response page size (0 if none)
// To not keep in logData:
//   - error.type only
//   - params
//   - queryVars
//   - headers
//   - payload
//   - response content
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
