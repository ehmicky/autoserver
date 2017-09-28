'use strict';

const { getStandardError } = require('../../../error');

const { validateResponse } = require('./validate');
const { handlers } = require('./handlers');
const transformMap = require('./transform');

// Sends the response at the end of the request
const sendResponse = function ({
  error,
  response,
  operation,
  specific,
  protocolHandler,
  protocolStatus,
  mInput,
}) {
  const responseA = getErrorResponse({ mInput, error, response, operation });

  validateResponse({ response: responseA });

  // Use different logic according to the content type
  const { type, content } = responseA;
  handlers[type]({ protocolHandler, specific, content, protocolStatus });

  return { response: responseA };
};

// Use protocol-specific way to send back the response to the client
const getErrorResponse = function ({ mInput, error, response, operation }) {
  if (!error) { return response; }

  const errorA = getStandardError({ error, mInput, isLimited: false });
  const responseA = createErrorResponse({ operation, error: errorA });
  return responseA;
};

// Creates protocol-independent response error, using an error object
const createErrorResponse = function ({ operation, error }) {
  const response = { type: 'error', content: error };

  // E.g. operation-specific error format, e.g. GraphQL
  const transformer = transformMap[operation];

  if (transformer) {
    return transformer.transformErrorResponse({ response });
  }

  return response;
};

module.exports = {
  sendResponse,
};
