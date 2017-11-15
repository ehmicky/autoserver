'use strict';

// Retrieves HTTP status code
const getProtocolstatus = function ({
  error,
  error: { reason = 'UNKNOWN' } = {},
}) {
  if (!error) { return PROTOCOLSTATUSES_MAP.SUCCESS; }

  return PROTOCOLSTATUSES_MAP[reason] || PROTOCOLSTATUSES_MAP.UNKNOWN_TYPE;
};

// All error reasons and their related HTTP status code
const PROTOCOLSTATUSES_MAP = {
  SUCCESS: 200,

  PAYLOAD_PARSE: 400,
  QUERY_STRING_PARSE: 400,
  SYNTAX_VALIDATION: 400,
  INPUT_VALIDATION: 400,
  WRONG_METHOD: 400,
  WRONG_FEATURE: 400,

  AUTHORIZATION: 403,

  ROUTE_NOT_FOUND: 404,
  DB_MODEL_NOT_FOUND: 404,

  RESPONSE_FORMAT: 406,

  REQUEST_TIMEOUT: 408,

  DB_CONFLICT: 409,

  NO_CONTENT_LENGTH: 411,

  INPUT_LIMIT: 413,

  URL_LIMIT: 414,

  REQUEST_FORMAT: 415,

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
const failureProtocolstatus = 500;

// Retrieves generic status, using HTTP status code
const getStatus = function ({ protocolstatus = '' }) {
  const [statusCategory] = String(protocolstatus);
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
  getProtocolstatus,
  getStatus,
  failureProtocolstatus,
};
