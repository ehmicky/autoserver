'use strict';

const { omitBy } = require('../utilities');

const { getReason, getGenericProps } = require('./reasons');
const { normalizeError } = require('./main');

// Gets normalized error information
const getStandardError = function ({
  error,
  limitedInput: {
    url: instance,
    status = 'SERVER_ERROR',
  } = {},
  fullInput: {
    protocolStatus,
    protocol,
    method,
    headers,
    queryVars,
    operation,
    operationSummary,
    topArgs: args,
    action: { name: action } = {},
    actionPath,
    modelName: model,
    command: { name: command } = {},
    requestId,
  } = {},
}) {
  if (!error) { return; }

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
    operation_summary: operationSummary,
    action,
    action_path: actionPath && actionPath.join('.'),
    model,
    args,
    command,
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
