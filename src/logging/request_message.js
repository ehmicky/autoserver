'use strict';


// Build message of logs of type `request` as:
//  STATUS [ERROR] - PROTOCOL METHOD /PATH ACTION...
const getRequestMessage = function ({
  protocol,
  protocolMethod,
  path,
  protocolStatus,
  error,
  actions = {},
  fullAction,
}) {
  const action = error ? fullAction : Object.keys(actions).join(' ');
  const message = [
    protocolStatus,
    error,
    '-',
    protocol,
    protocolMethod,
    path,
    action,
  ].filter(val => val)
    .join(' ');
  return message;
};


module.exports = {
  getRequestMessage,
};
