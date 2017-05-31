'use strict';


const { cloneDeep } = require('lodash');


// Keep almost all properties of logInfo.
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
const getRequestInfo = function (logInfo) {
  const requestInfo = cloneDeep(logInfo);

  setParams(requestInfo);
  setQueryVars(requestInfo);
  setHeaders(requestInfo);
  setPayload(requestInfo);
  setActions(requestInfo);
  setResponse(requestInfo);

  return requestInfo;
};

const setParams = function (requestInfo) {
  if (!requestInfo.params) { return; }

  requestInfo.paramsKeys = Object.keys(requestInfo.params);
  delete requestInfo.params;
};

const setQueryVars = function (requestInfo) {
  if (!requestInfo.queryVars) { return; }

  requestInfo.queryVarsKeys = Object.keys(requestInfo.queryVars);
  delete requestInfo.queryVars;
};

const setHeaders = function (requestInfo) {
  if (!requestInfo.headers) { return; }

  requestInfo.headersKeys = Object.keys(requestInfo.headers);
  delete requestInfo.headers;
};

const setPayload = function (requestInfo) {
  requestInfo.payloadSize = requestInfo.payload === undefined
    ? 0
    : JSON.stringify(requestInfo.payload).length;
  delete requestInfo.payload;
};

const setActions = function (requestInfo) {
  if (!requestInfo.actions) { return; }

  for (const actionInfo of Object.values(requestInfo.actions)) {
    setAction(actionInfo);
  }
};

const setAction = function (actionInfo) {
  setArgData(actionInfo);
  setActionResponses(actionInfo);
};

const setArgData = function (actionInfo) {
  const { args } = actionInfo;
  if (!args || !args.data) { return; }

  args.dataSize = JSON.stringify(args.data).length;
  delete args.data;
};

const setActionResponses = function (actionInfo) {
  const { responses } = actionInfo;
  if (!responses) { return; }

  actionInfo.responses = responses.map(response => {
    setActionResponse(response);
    return response;
  });
};

const setActionResponse = function (response) {
  if (!response.content) { return; }

  response.contentSize = JSON.stringify(response.content).length;
  delete response.content;
};

const setResponse = function (requestInfo) {
  if (!requestInfo.response) { return; }

  requestInfo.responseSize = JSON.stringify(requestInfo.response).length;
  delete requestInfo.response;
};


module.exports = {
  getRequestInfo,
};
