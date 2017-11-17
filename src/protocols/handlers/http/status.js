'use strict';

// All HTTP status codes, according to error reason
const STATUS_CODE_MAP = {
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
  WRONG_COMMAND: 405,

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
  SERVER_INPUT_VALIDATION: 500,
  OUTPUT_VALIDATION: 500,
  PROTOCOL_ERROR: 500,
  DB_ERROR: 500,
  PROCESS_ERROR: 500,
  EVENT_ERROR: 500,
  UTILITY_ERROR: 500,
  UNKNOWN: 500,
};

// Generic error status when none can be found
const FAILURE_STATUS_CODE = 500;

// Set response's HTTP status code
const setStatusCode = function ({ res, reason }) {
  const statuscode = STATUS_CODE_MAP[reason] || FAILURE_STATUS_CODE;
  // eslint-disable-next-line no-param-reassign, fp/no-mutation
  res.statusCode = statuscode;
};

module.exports = {
  setStatusCode,
};
