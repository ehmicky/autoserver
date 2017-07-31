'use strict';

const transformMap = require('./transform');

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
  getResponse,
};
