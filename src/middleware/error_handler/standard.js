'use strict';


const { omitBy } = require('lodash');

const { getReason, getErrorReason } = require('../../error');


// Gets normalized error information
// TODO: how to see this is StartupError? error.name?
const getStandardError = function ({
  error,
  info: {
    url: instance = 'unknown',
    status,
    protocolStatus,
    protocol,
    protocolMethod,
    interface: interf,
    action,
    fullAction,
    model,
    args,
    command,
  },
}) {
  if (!(error instanceof Error)) {
    error = new Error(String(error));
  }

  const type = getReason({ error });
  const { title } = getErrorReason({ error });
  const {
    message: description,
    stack: outerStack,
    innererror: { stack: details = outerStack } = {},
  } = error;

  // Order matters, as this will be kept in final output
  const errorObj = {
    type,
    title,
    description,
    instance,
    status,
    protocol_status: protocolStatus,
    protocol,
    protocol_method: protocolMethod,
    interface: interf,
    action: action.name,
    action_path: fullAction,
    model,
    args,
    command: command.name,
    details,
  };

  // Do not expose undefined values
  const standardError = omitBy(errorObj, val => val === undefined);

  return standardError;
};


module.exports = {
  getStandardError,
};
