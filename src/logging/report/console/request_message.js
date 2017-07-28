'use strict';

// Build message of logs of type `request` as:
//  STATUS [ERROR] - PROTOCOL METHOD /PATH ACTION...
const getRequestMessage = function ({
  protocol,
  method,
  path,
  protocolStatus,
  error,
  actions = {},
  fullAction,
  responseTime,
}) {
  const action = error ? fullAction : Object.keys(actions).join(' ');
  const responseTimeText = responseTime && `${Math.round(responseTime)}ms`;

  const message = [
    protocolStatus,
    error,
    '-',
    protocol,
    method,
    path,
    action,
    responseTimeText,
  ].filter(val => val)
    .join(' ');
  return message;
};

module.exports = {
  getRequestMessage,
};
