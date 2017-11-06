'use strict';

// Build message of events of type `request` as:
//  STATUS [ERROR] - PROTOCOL METHOD /PATH COMMAND...
const getRequestMessage = function ({
  protocol,
  method,
  path,
  protocolstatus,
  error,
  commandPath,
  summary,
}) {
  const summaryA = error ? commandPath : summary;

  const message = [
    protocolstatus,
    error,
    '-',
    protocol,
    method,
    path,
    summaryA,
  ].filter(val => val)
    .join(' ');
  return message;
};

module.exports = {
  getRequestMessage,
};
