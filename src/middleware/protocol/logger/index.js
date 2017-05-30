'use strict';


const { cloneDeep } = require('lodash');

const { log } = require('../../../utilities');
const { getReason } = require('../../../error');


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

      const reason = getReason({ error });
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
  const leanLogInfo = cloneDeep(logInfo);

  leanParams(leanLogInfo);
  leanQueryVars(leanLogInfo);
  leanHeaders(leanLogInfo);
  leanPayload(leanLogInfo);
  leanActions(leanLogInfo);
  leanResponse(leanLogInfo);

  return leanLogInfo;
};
const leanParams = function (leanLogInfo) {
  if (!leanLogInfo.params) { return; }

  leanLogInfo.paramsKeys = Object.keys(leanLogInfo.params);
  delete leanLogInfo.params;
};

const leanQueryVars = function (leanLogInfo) {
  if (!leanLogInfo.queryVars) { return; }

  leanLogInfo.queryVarsKeys = Object.keys(leanLogInfo.queryVars);
  delete leanLogInfo.queryVars;
};

const leanHeaders = function (leanLogInfo) {
  if (!leanLogInfo.headers) { return; }

  leanLogInfo.headersKeys = Object.keys(leanLogInfo.headers);
  delete leanLogInfo.headers;
};

const leanPayload = function (leanLogInfo) {
  leanLogInfo.payloadSize = leanLogInfo.payload === undefined
    ? 0
    : JSON.stringify(leanLogInfo.payload).length;
  delete leanLogInfo.payload;
};

const leanActions = function (leanLogInfo) {
  if (!leanLogInfo.actions) { return; }

  for (const actionInfo of Object.values(leanLogInfo.actions)) {
    leanAction(actionInfo);
  }
};

const leanAction = function (actionInfo) {
  leanArgData(actionInfo);
  leanActionResponses(actionInfo);
};

const leanArgData = function (actionInfo) {
  const { args } = actionInfo;
  if (!args || !args.data) { return; }

  args.dataSize = JSON.stringify(args.data).length;
  delete args.data;
};

const leanActionResponses = function (actionInfo) {
  const { responses } = actionInfo;
  if (!responses) { return; }

  actionInfo.responses = responses.map(response => {
    leanActionResponse(response);
    return response;
  });
};

const leanActionResponse = function (response) {
  if (!response.content) { return; }

  response.contentSize = JSON.stringify(response.content).length;
  delete response.content;
};

const leanResponse = function (leanLogInfo) {
  if (!leanLogInfo.response) { return; }

  leanLogInfo.responseSize = JSON.stringify(leanLogInfo.response).length;
  delete leanLogInfo.response;
};


// logInfo:
//   - requestId
//   + timestamp
//   + ip
//   + protocol
//   + protocolFullName
//   + url
//   + path
//   + route
//   + protocolMethod
//   + method
//   + status
//   + protocolStatus
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
//   + response (the one that was sent): content, type
//   + error reason
// logInfo.lean:
//   - shortened version, i.e.:
//      - params -> paramsKeys (keys only)
//      - queryVars -> queryVarsKeys (keys only)
//      - headers -> headersKeys (keys only)
//      - payload -> payloadSize (size only)
//      - actions.ACTION_PATH.args.data -> dataSize (size only)
//      - actions.ACTION_PATH.responses.content -> contentSize (size only)
//      - response.content -> contentSize (size only)
// requestId:
//   - UUID/v4
//   - available in response headers sent (including on errors)
//   - as JSL param REQUEST_ID
//   - available in logInfo
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
  console.log(JSON.stringify(logInfo.lean, null, 2));
  return;
  const { message, rawMessage } = logInfo;
  log.log(message);
};


module.exports = {
  logger,
};
