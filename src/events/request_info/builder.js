'use strict';

const { getReason } = require('../../error');
const { MODEL_TYPES } = require('../../constants');

// Builds requestinfo from request mInput
const buildRequestinfo = function ({
  requestid,
  timestamp,
  responsetime,
  ip,
  protocol,
  url,
  origin,
  path,
  method,
  protocolstatus,
  status = 'SERVER_ERROR',
  pathVars,
  queryVars,
  requestHeaders,
  responseHeaders,
  payload,
  operation,
  operationSummary,
  topArgs: args,
  commandPath,
  command,
  modelName: model,
  response: {
    content: response,
    type: responseType,
  } = {},
  modelsCount,
  uniqueModelsCount,
  error,
}) {
  const responseData = MODEL_TYPES.includes(responseType)
    ? response.data
    : response;
  const errorReason = error && getReason({ error });

  return {
    requestid,
    timestamp,
    responsetime,
    ip,
    protocol,
    url,
    origin,
    path,
    method,
    protocolstatus,
    status,
    pathVars,
    queryVars,
    requestHeaders,
    responseHeaders,
    payload,
    operation,
    operationSummary,
    args,
    commandPath,
    command,
    model,
    responseData,
    responseType,
    modelsCount,
    uniqueModelsCount,
    error: errorReason,
  };
};

module.exports = {
  buildRequestinfo,
};
