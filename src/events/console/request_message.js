'use strict';

// Build message of events of type `request` as:
//  STATUS [ERROR] - PROTOCOL METHOD /PATH ACTION...
const getRequestMessage = function ({
  protocol,
  method,
  path,
  protocolStatus,
  error,
  actionPath,
  operationSummary,
}) {
  const summary = error ? actionPath : operationSummary;

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
