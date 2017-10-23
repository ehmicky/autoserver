'use strict';

// Retrieves HTTP status code
const getProtocolStatus = function ({
  error,
  error: { reason = 'UNKNOWN' } = {},
}) {
  if (!error) { return PROTOCOL_STATUSES_MAP.SUCCESS; }

  return PROTOCOL_STATUSES_MAP[reason] || PROTOCOL_STATUSES_MAP.UNKNOWN_TYPE;
};

// All error reasons and their related HTTP status code
const PROTOCOL_STATUSES_MAP = {
  SUCCESS: 200,

  PAYLOAD_PARSE: 400,
  QUERY_STRING_PARSE: 400,
  SYNTAX_VALIDATION: 400,
  INPUT_VALIDATION: 400,
  WRONG_FEATURE: 400,

  AUTHORIZATION: 403,

  ROUTE_NOT_FOUND: 404,
  DB_MODEL_NOT_FOUND: 404,

  WRONG_METHOD: 405,

  REQUEST_TIMEOUT: 408,

  DB_MODEL_CONFLICT: 409,

  NO_CONTENT_LENGTH: 411,
  INPUT_LIMIT: 413,
  URL_LIMIT: 414,
  WRONG_CONTENT_TYPE: 415,

  FILE_OPEN_ERROR: 500,
  SCHEMA_SYNTAX_ERROR: 500,
  SCHEMA_VALIDATION: 500,
  CONF_VALIDATION: 500,
  CONF_LOADING: 500,
  INPUT_SERVER_VALIDATION: 500,
  OUTPUT_VALIDATION: 500,
  PROTOCOL_ERROR: 500,
  DB_ERROR: 500,
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
  return STATUSES_MAP[statusCategory];
};

const STATUSES_MAP = {
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
