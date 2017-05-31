'use strict';


const { omitBy } = require('lodash');

const { infoSym } = require('../logging');
const { getReason, getGenericProps } = require('./reasons');


// Gets normalized error information
const getStandardError = function ({ log, error }) {
  const {
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
    requestId,
  } = log[infoSym] || {};

  if (!(error instanceof Error)) {
    error = new Error(String(error));
  }

  const type = getReason({ error });
  const { title } = getGenericProps({ error });
  const {
    message: description,
    stack: outerStack,
    innererror: { stack: details = outerStack } = {},
    extra,
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
    action: action && action.name,
    action_path: fullAction,
    model,
    args,
    command: command && command.name,
  };
  Object.assign(errorObj, extra, { request_id: requestId, details });

  // Do not expose undefined values
  const standardError = omitBy(errorObj, val => val === undefined);

  return standardError;
};


module.exports = {
  getStandardError,
};
