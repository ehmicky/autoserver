'use strict';

// Retrieves HTTP status code
const getProtocolStatus = function ({
  error,
  error: { reason = 'UNKNOWN' } = {},
}) {
  if (!error) { return 200; }

  return protocolStatusesMap[reason] || protocolStatusesMap.UNKNOWN_TYPE;
};

// All error reasons and their related HTTP status code
const protocolStatusesMap = {
  UNSUPPORTED_METHOD: 400,
  NO_CONTENT_TYPE: 400,
  QUERY_STRING_PARSE: 400,
  UNSUPPORTED_OPERATION: 400,
  GRAPHQL_NO_QUERY: 400,
  GRAPHQL_SYNTAX_ERROR: 400,
  INPUT_VALIDATION: 400,

  AUTHORIZATION: 403,

  NOT_FOUND: 404,
  DATABASE_NOT_FOUND: 404,

  WRONG_COMMAND: 405,

  REQUEST_TIMEOUT: 408,

  DATABASE_MODEL_CONFLICT: 409,

  INPUT_LIMIT: 413,
  WRONG_CONTENT_TYPE: 415,

  FILE_OPEN_ERROR: 500,
  IDL_SYNTAX_ERROR: 500,
  IDL_VALIDATION: 500,
  CONF_VALIDATION: 500,
  CONF_LOADING: 500,
  GRAPHQL_WRONG_DEFINITION: 500,
  GRAPHQL_INTROSPECTION: 500,
  GRAPHIQL_PARSING_ERROR: 500,
  INPUT_SERVER_VALIDATION: 500,
  OUTPUT_VALIDATION: 500,
  PROCESS_ERROR: 500,
  EVENT_ERROR: 500,
  UTILITY_ERROR: 500,
  UNKNOWN_TYPE: 500,
  UNKNOWN: 500,
};

// Generic error status when none can be found
const failureProtocolStatus = 500;

// Retrieves generic status, using HTTP status code
const getStatus = function ({ protocolStatus = '' }) {
  const [statusCategory] = String(protocolStatus);
  return statusesMap[statusCategory];
};

const statusesMap = {
  1: 'INTERNALS',
  2: 'SUCCESS',
  3: 'INTERNALS',
  4: 'CLIENT_ERROR',
  5: 'SERVER_ERROR',
};

module.exports = {
  getProtocolStatus,
  getStatus,
  failureProtocolStatus,
};
