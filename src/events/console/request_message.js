'use strict';

// Build message of events of type `request` as:
//  STATUS [ERROR] - PROTOCOL METHOD /PATH ACTION...
const getRequestMessage = function ({
  protocol,
  method,
  path,
  protocolStatus,
  error,
  actions = {},
  actionPath,
}) {
  const action = error ? actionPath : Object.keys(actions).join(' ');

  const message = [
    protocolStatus,
    error,
    '-',
    protocol,
    method,
    path,
    action,
  ].filter(val => val)
    .join(' ');
  return message;
};

module.exports = {
  getRequestMessage,
};
