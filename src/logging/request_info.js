'use strict';


const { cloneDeep, omit } = require('lodash');


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
//   - pathVars
//   - (params)
//   - (queryVars)
//   - (headers)
//   - (payload)
//   - protocolArgs
//   - interface
//   - (actions):
//      - ACTION_PATH:
//          - model
//          - args (original)
//          - responses OBJ_ARR:
//             - content
//   - (response): content, type
//   - phase: 'request', 'startup' or 'shutdown'
//   - error

// Keep almost all properties of log.
// Remove some properties of log which could be of big size, specifically:
//   - params, queryVars, headers:
//      - apply server option loggerFilter.params|queryVars|headers, which is
//        either a simple mapping function or a list of attribute names.
//        It defaults to returning an empty object.
//   - payload, actions.ACTION_PATH.args.data,
//     actions.ACTION_PATH.responses.content, response.content:
//      - apply server option loggerFilter.payload|argData|actionResponses|
//        response, which is either a simple mapping function or a list of
//        attribute names. It is applied to each model if the value is an array.
//        It defaults to keeping only 'id'.
//      - set JSON size, e.g. `payloadSize`
//        'unknown' if cannot calculate. Not set if value is undefined.
//      - set array length, e.g. `payloadCount` if it is an array.
// Also rename `errorReason` to `error`.
const getRequestInfo = function (log, loggerFilter) {
  const requestInfo = removeKeys(cloneDeep(log));

  setError(requestInfo);
  reduceInput(requestInfo, loggerFilter);
  reduceAllModels(requestInfo, loggerFilter);

  return requestInfo;
};


const removeKeys = function (requestInfo) {
  return omit(requestInfo, excludedKeys);
};
const excludedKeys = [
  // Those are already present in errorInfo
  'action',
  'fullAction',
  'model',
  'args',
  'command',
];

const setError = function (requestInfo) {
  if (!requestInfo.errorReason) { return; }
  requestInfo.error = requestInfo.errorReason;
  delete requestInfo.errorReason;
};

const reduceInput = function (requestInfo, loggerFilter) {
  setParams(requestInfo, loggerFilter);
  setQueryVars(requestInfo, loggerFilter);
  setHeaders(requestInfo, loggerFilter);
};

const setParams = function (requestInfo, loggerFilter) {
  const { params } = requestInfo;
  if (!params || params.constructor !== Object) { return; }
  requestInfo.params = loggerFilter.params(params);
};

const setQueryVars = function (requestInfo, loggerFilter) {
  const { queryVars } = requestInfo;
  if (!queryVars || queryVars.constructor !== Object) { return; }
  requestInfo.queryVars = loggerFilter.queryVars(queryVars);
};

const setHeaders = function (requestInfo, loggerFilter) {
  const { headers } = requestInfo;
  if (!headers || headers.constructor !== Object) { return; }
  requestInfo.headers = loggerFilter.headers(headers);
};

const reduceAllModels = function (requestInfo, loggerFilter) {
  setPayload(requestInfo, loggerFilter);
  setActions(requestInfo, loggerFilter);
  setResponse(requestInfo, loggerFilter);
};

const setPayload = function (requestInfo, loggerFilter) {
  reduceModels({
    info: requestInfo,
    attrName: 'payload',
    filter: loggerFilter.payload,
  });
};

const setActions = function (requestInfo, loggerFilter) {
  const { actions } = requestInfo;
  if (!actions || actions.constructor !== Object) { return; }

  for (const actionInfo of Object.values(actions)) {
    setArgData(actionInfo, loggerFilter);
    setActionResponses(actionInfo, loggerFilter);
  }
};

const setArgData = function (actionInfo, loggerFilter) {
  reduceModels({
    info: actionInfo.args,
    attrName: 'data',
    filter: loggerFilter.argData,
  });
};

const setActionResponses = function (actionInfo, loggerFilter) {
  if (actionInfo.responses && actionInfo.responses instanceof Array) {
    actionInfo.responses = actionInfo.responses.map(({ content } = {}) => {
      return content;
    });
  }

  reduceModels({
    info: actionInfo,
    attrName: 'responses',
    filter: loggerFilter.actionResponses,
  });
};

const setResponse = function (requestInfo, loggerFilter) {
  reduceModels({
    info: requestInfo,
    attrName: 'response',
    filter: loggerFilter.response,
  });
};

const reduceModels = function ({ info, attrName, filter }) {
  if (!info) { return; }

  if (info[attrName] === undefined) { return; }

  let size;
  try {
    size = JSON.stringify(info[attrName]).length;
  } catch (e) {
    size = 'unknown';
  }
  info[`${attrName}Size`] = size;

  if (info[attrName] instanceof Array) {
    info[`${attrName}Count`] = info[attrName].length;
    info[attrName] = info[attrName].map(obj => {
      if (!obj || obj.constructor !== Object) { return; }
      return filter(obj);
    });
  } else if (info[attrName] && info[attrName].constructor === Object) {
    info[attrName] = filter(info[attrName]);
  } else if (!info[attrName]) {
    delete info[attrName];
  }
};


module.exports = {
  getRequestInfo,
};
