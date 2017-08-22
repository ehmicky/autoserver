'use strict';

const transformMap = require('./transform');

// Use protocol-specific way to send back the response to the client
const sendErrorResponse = async function ({
  error: { protocolStatus, sendError },
  standardError,
}) {
  if (!sendError) { return; }

  const errorResponse = getResponse({ error: standardError });
  const response = { ...errorResponse, protocolStatus };
  await sendError(response);
};

// Creates protocol-independent response error, using an error object
const getResponse = function ({ error }) {
  const response = { type: 'error', content: error };

  // E.g. operation-specific error format, e.g. GraphQL
  const transformer = transformMap[error.operation];

  if (transformer) {
    return transformer.transformResponse({ response });
  }

  return response;
};

module.exports = {
  sendErrorResponse,
};
