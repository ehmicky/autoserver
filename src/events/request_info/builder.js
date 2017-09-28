'use strict';

const { getReason } = require('../../error');

// Builds requestInfo from request mInput
const buildRequestInfo = function ({
  requestId,
  timestamp,
  responseTime,
  ip,
  protocol,
  protocolFullName,
  url,
  origin,
  path,
  route,
  method,
  protocolStatus,
  status = 'SERVER_ERROR',
  pathVars,
  queryVars,
  headers,
  payload,
  operation,
  operationSummary,
  topArgs: args,
  actionPath,
  action: { name: action } = {},
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
  const errorReason = error && getReason({ error });

  return {
    requestId,
    timestamp,
    responseTime,
    ip,
    protocol,
    protocolFullName,
    url,
    origin,
    path,
    route,
    method,
    protocolStatus,
    status,
    pathVars,
    queryVars,
    headers,
    payload,
    operation,
    operationSummary,
    args,
    actionPath,
    action,
    command,
    model,
    response,
    responseType,
    modelsCount,
    uniqueModelsCount,
    error: errorReason,
  };
};

module.exports = {
  buildRequestInfo,
};
