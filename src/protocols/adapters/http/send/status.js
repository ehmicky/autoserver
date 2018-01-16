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

  // The URL or route is invalid
  ROUTE: 404,
  // A database model could not be found, e.g. the id was invalid.
  // Extra:
  //  - ids STR_ARR
  NOT_FOUND: 404,

  // The protocol method is unknown or invalid.
  // Extra:
  //  - suggestions STR_ARR
  METHOD: 405,
  // The command name is unknown or invalid.
  // Extra:
  //  - suggestions STR_ARR
  COMMAND: 405,

  // The response could not be serialized or content negotiation failed.
  // Extra:
  //  - kind 'compress|charset|format'
  RESPONSE_NEGOTIATION: 406,

  // The request took too much time to process.
  // Extra:
  //  - limit NUM
  TIMEOUT: 408,

  // Another client updated the same model, resulting in a conflict.
  // Extra:
  //  - ids STR_ARR
  CONFLICT: 409,

  // The request payload's length must be specified
  NO_CONTENT_LENGTH: 411,

  // The request payload is too big.
  // Extra:
  //  - kind STR
  //  - value NUM
  //  - limit NUM
  PAYLOAD_LIMIT: 413,

  // The URL is too big.
  // Extra:
  //  - value NUM
  //  - limit NUM
  URL_LIMIT: 414,

  // The request payload could not be loaded, parsed or content negotiation
  // failed.
  // Extra:
  //  - kind 'parse|compress|charset|format'
  PAYLOAD_NEGOTIATION: 415,

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
