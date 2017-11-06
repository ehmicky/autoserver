'use strict';

const { omitBy } = require('../utilities');

const { getReason, getGenericProps } = require('./reasons');
const { normalizeError } = require('./main');

// Gets normalized error information
const getStandardError = function ({ error, mInput, isLimited }) {
  if (!error) { return; }

  const errorA = normalizeError({ error });

  const errorB = fillError({ error: errorA, mInput, isLimited });

  // Do not expose undefined values
  const errorC = omitBy(errorB, val => val === undefined);

  return errorC;
};

// Order matters, as this will be kept in final output
const fillError = function ({
  error,
  mInput: {
    url: instance,
    status = 'SERVER_ERROR',
    protocolStatus,
    protocol,
    method,
    requestHeaders,
    queryVars,
    operation,
    operationSummary,
    topArgs: args,
    commandPath,
    modelName: model,
    command,
    requestid,
  } = {},
  isLimited = true,
}) {
  const type = getReason({ error });
  const { title } = getGenericProps({ error });

  const {
    message: description,
    stack: outerStack,
    innererror: { stack: details = outerStack } = {},
    extra = {},
  } = error;

  const errorA = { type, title, description, instance, status };

  if (isLimited) {
    return { ...errorA, ...extra, details };
  }

  return {
    ...errorA,
    protocol_status: protocolStatus,
    protocol,
    method,
    request_headers: requestHeaders,
    queryVars,
    operation,
    operation_summary: operationSummary,
    args,
    command_path: commandPath,
    model,
    command,
    requestid: requestid,
    ...extra,
    // Stack trace is not included in error responses, whether in production
    // or in development because:
    //  - it might leak user-supplied code structure (e.g. event payload
    //    handlers)
    //  - it is already present in exception thrown, console event messages and
    //    failure event payload
  };
};

module.exports = {
  getStandardError,
};
