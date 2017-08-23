'use strict';

const { getStandardError } = require('../../../error');

const { sender } = require('./sender');
const transformMap = require('./transform');

// Sends the response at the end of the request
const sendResponse = function ({
  error,
  response,
  operation,
  specific,
  protocolHandler,
  protocolStatus,
  input,
}) {
  const responseA = getErrorResponse({ input, error, response, operation });

  sender({ specific, protocolHandler, protocolStatus, response: responseA });

  return { response: responseA };
};

// Use protocol-specific way to send back the response to the client
const getErrorResponse = function ({ input, error, response, operation }) {
  if (!error) { return response; }

  const errorA = getStandardError({ error, input });
  const responseA = createErrorResponse({ operation, error: errorA });
  return responseA;
};

// Creates protocol-independent response error, using an error object
const createErrorResponse = function ({ operation, error }) {
  const response = { type: 'error', content: error };

  // E.g. operation-specific error format, e.g. GraphQL
  const transformer = transformMap[operation];

  if (transformer) {
    return transformer.transformResponse({ response });
  }

  return response;
};

module.exports = {
  sendResponse,
};
