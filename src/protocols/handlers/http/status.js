'use strict';


// Retrieves HTTP status code
const getProtocolStatus = function ({ error }) {
  if (!error) { return 200; }

  const { reason = 'UNKNOWN' } = error;
  return protocolStatusesMap[reason] || protocolStatusesMap.UNKNOWN_TYPE;
};

// All error reasons and their related HTTP status code
const protocolStatusesMap = {
  UNSUPPORTED_PROTOCOL: 400,
  UNSUPPORTED_METHOD: 400,
  NO_CONTENT_TYPE: 400,
  QUERY_STRING_PARSE: 400,
  UNSUPPORTED_OPERATION: 400,
  GRAPHQL_NO_QUERY: 400,
  GRAPHQL_SYNTAX_ERROR: 400,
  INPUT_VALIDATION: 400,

  NOT_FOUND: 404,
  DATABASE_NOT_FOUND: 404,

  WRONG_COMMAND: 405,

  DATABASE_MODEL_CONFLICT: 409,

  INPUT_LIMIT: 413,
  WRONG_CONTENT_TYPE: 415,

  FILE_OPEN_ERROR: 500,
  QUERY_STRING_SERIALIZE: 500,
  IDL_SYNTAX_ERROR: 500,
  IDL_VALIDATION: 500,
  OPTIONS_VALIDATION: 500,
  GRAPHQL_WRONG_DEFINITION: 500,
  GRAPHQL_WRONG_INTROSPECTION_SCHEMA: 500,
  GRAPHIQL_PARSING_ERROR: 500,
  INPUT_SERVER_VALIDATION: 500,
  OUTPUT_VALIDATION: 500,
  WRONG_RESPONSE: 500,
  PROCESS_ERROR: 500,
  UTILITY_ERROR: 500,
  UNKNOWN_TYPE: 500,
  UNKNOWN: 500,
};

// Retrieves generic status, using HTTP status code
const getStatus = function ({ protocolStatus }) {
  const statusCategory = String(protocolStatus)[0];
  return statusesMap[statusCategory] || 'SERVER_ERROR';
};

const statusesMap = {
  '1': 'INTERNALS',
  '2': 'SUCCESS',
  '3': 'INTERNALS',
  '4': 'CLIENT_ERROR',
  '5': 'SERVER_ERROR',
};


module.exports = {
  getProtocolStatus,
  getStatus,
};
