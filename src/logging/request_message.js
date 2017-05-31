'use strict';


const getRequestMessage = function ({
  protocolFullName,
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
    protocolFullName,
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
