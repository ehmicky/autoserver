'use strict';

// Build message of events of type `request` as:
//  STATUS [ERROR] - PROTOCOL METHOD /PATH COMMAND...
const getRequestMessage = function ({
  protocol,
  method,
  path,
  protocolStatus,
  error,
  commandPath,
  operationSummary,
}) {
  const summary = error ? commandPath : operationSummary;

  const message = [
    protocolStatus,
    error,
    '-',
    protocol,
    method,
    path,
    summary,
  ].filter(val => val)
    .join(' ');
  return message;
};

module.exports = {
  getRequestMessage,
};
