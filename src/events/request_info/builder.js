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
  goal,
  protocolStatus,
  status = 'SERVER_ERROR',
  pathVars,
  params,
  settings,
  queryVars,
  headers,
  payload,
  operation,
  actionsInfo: actions,
  fullAction: actionPath,
  action: { name: action } = {},
  command: { name: command } = {},
  modelName: model,
  args,
  response: {
    content: response,
    type: responseType,
  } = {},
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
    goal,
    protocolStatus,
    status,
    pathVars,
    params,
    settings,
    queryVars,
    headers,
    payload,
    operation,
    actions,
    actionPath,
    action,
    command,
    model,
    args,
    response,
    responseType,
    error: errorReason,
  };
};

module.exports = {
  buildRequestInfo,
};
