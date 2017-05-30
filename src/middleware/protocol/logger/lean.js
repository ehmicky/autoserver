'use strict';


const { cloneDeep } = require('lodash');


// Remove some properties of logInfo which could be of big size, specifically:
//   - keep only keys in:
//      - params -> paramsKeys
//      - queryVars -> queryVarsKeys
//      - headers -> headersKeys
//   - keep only size in:
//      - payload -> payloadSize
//      - actions.ACTION_PATH.args.data -> dataSize
//      - actions.ACTION_PATH.responses.content -> contentSize
//      - response.content -> contentSize
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


module.exports = {
  getLeanLogInfo,
};
