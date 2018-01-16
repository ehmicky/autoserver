'use strict';

// All HTTP status codes, according to error reason
const STATUS_CODE_MAP = {
  // Request was successful, i.e. there is no error.
  SUCCESS: 200,

  // Wrong configuration caught compile-time.
  // Extra:
  //  - path 'VARR'
  //  - value VAL
  //  - suggestion VAL
  CONFIG_VALIDATION: 0,

  SYNTAX_VALIDATION: 400,
  INPUT_VALIDATION: 400,
  WRONG_FEATURE: 400,

  AUTHORIZATION: 403,

  ROUTE_NOT_FOUND: 404,
  MODEL_NOT_FOUND: 404,

  WRONG_METHOD: 405,
  WRONG_COMMAND: 405,

  RESPONSE_FORMAT: 406,

  REQUEST_TIMEOUT: 408,

  MODEL_CONFLICT: 409,

  NO_CONTENT_LENGTH: 411,

  // The request payload is too big.
  // Extra:
  //  - name 'NAME'
  //  - value NUM
  //  - limit NUM
  PAYLOAD_LIMIT: 413,

  URL_LIMIT: 414,

  // The request payload could not be loaded or parsed.
  REQUEST_FORMAT: 415,

  CONFIG_RUNTIME: 500,

  FORMAT: 500,
  CHARSET: 500,
  PROTOCOL: 500,
  RPC: 500,
  DATABASE: 500,
  LOG: 500,
  COMPRESS: 500,
  PLUGIN: 500,

  PROCESS: 500,
  ENGINE: 500,
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
