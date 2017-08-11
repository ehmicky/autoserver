'use strict';

const { omitBy } = require('../utilities');

const { getReason, getGenericProps } = require('./reasons');
const { normalizeError } = require('./main');

// Gets normalized error information
const getStandardError = function ({
  log: {
    logInfo: {
      url: instance,
      status = 'SERVER_ERROR',
      protocolStatus,
      protocol,
      method,
      headers,
      queryVars,
      operation,
      action,
      fullAction,
      model,
      args,
      command,
      requestId,
    } = {},
  } = {},
  error,
}) {
  const errorA = normalizeError({ error });
  const type = getReason({ error: errorA });
  const { title } = getGenericProps({ error: errorA });
  const {
    message: description,
    stack: outerStack,
    innererror: { stack: details = outerStack } = {},
    extra = {},
  } = errorA;

  // Order matters, as this will be kept in final output
  const errorB = {
    type,
    title,
    description,
    instance,
    status,
    protocol_status: protocolStatus,
    protocol,
    method,
    headers,
    queryVars,
    operation,
    action: action && action.name,
    action_path: fullAction,
    model,
    args,
    command: command && command.name,
    ...extra,
    request_id: requestId,
    details,
  };

  // Do not expose undefined values
  const errorC = omitBy(errorB, val => val === undefined);

  return errorC;
};

module.exports = {
  getStandardError,
};
