/* eslint-disable max-lines */
'use strict';

// List of errors
// Keys are the exception.reason of the exception thrown
// Values are merged to exceptions thrown
// All error reasons and their related status
const PROPS = {
  // Request was successful, i.e. there is no error.
  // HTTP status code: 200
  SUCCESS: {
    status: 'SUCCESS',
  },

  // Wrong configuration caught during server startup.
  // Extra:
  //  - path 'VARR'
  //  - value VAL
  //  - suggestion VAL
  // HTTP status code: none
  CONFIG_VALIDATION: {
    status: 'SERVER_ERROR',
  },

  // The request syntax or semantics is invalid.
  // Extra:
  //  - kind 'feature|protocol|rpc|argument|data|constraint'
  //  - path 'VARR'
  //  - suggestion VAL
  // HTTP status code: 400
  VALIDATION: {
    status: 'CLIENT_ERROR',
  },

  // The request is not authorized, i.e. not allowed to be performed.
  // Extra:
  //  - collection STR
  //  - ids STR_ARR
  // HTTP status code: 403
  AUTHORIZATION: {
    status: 'CLIENT_ERROR',
  },

  // The URL or route is invalid
  // HTTP status code: 404
  ROUTE: {
    status: 'CLIENT_ERROR',
  },
  // Some database models could not be found, e.g. the ids wre invalid.
  // Extra:
  //  - collection STR
  //  - ids STR_ARR
  // HTTP status code: 404
  NOT_FOUND: {
    status: 'CLIENT_ERROR',
    title: 'Model not found',
  },

  // The protocol method is unknown or invalid.
  // Extra:
  //  - suggestions STR_ARR
  // HTTP status code: 405
  METHOD: {
    status: 'CLIENT_ERROR',
  },
  // The command name is unknown or invalid.
  // Extra:
  //  - suggestions STR_ARR
  // HTTP status code: 405
  COMMAND: {
    status: 'CLIENT_ERROR',
  },

  // The response could not be serialized or content negotiation failed.
  // Extra:
  //  - kind 'compress|charset|format'
  // HTTP status code: 406
  RESPONSE_NEGOTIATION: {
    status: 'CLIENT_ERROR',
  },

  // The request took too much time to process.
  // Extra:
  //  - limit NUM
  // HTTP status code: 408
  TIMEOUT: {
    status: 'CLIENT_ERROR',
  },

  // Another client updated the same model, resulting in a conflict.
  // Extra:
  //  - collection STR
  //  - ids STR_ARR
  // HTTP status code: 409
  CONFLICT: {
    status: 'CLIENT_ERROR',
  },

  // The request payload's length must be specified
  // HTTP status code: 411
  NO_CONTENT_LENGTH: {
    status: 'CLIENT_ERROR',
  },

  // The request payload is too big.
  // Extra:
  //  - kind STR
  //  - value NUM
  //  - limit NUM
  // HTTP status code: 413
  PAYLOAD_LIMIT: {
    status: 'CLIENT_ERROR',
  },

  // The URL is too big.
  // Extra:
  //  - value NUM
  //  - limit NUM
  // HTTP status code: 414
  URL_LIMIT: {
    status: 'CLIENT_ERROR',
  },

  // The request payload could not be loaded, parsed or content negotiation
  // failed.
  // Extra:
  //  - kind 'parse|compress|charset|format'
  // HTTP status code: 415
  PAYLOAD_NEGOTIATION: {
    status: 'CLIENT_ERROR',
  },

  // Wrong configuration caught runtime.
  // Extra:
  //  - path 'VARR'
  //  - value VAL
  //  - suggestion VAL
  // HTTP status code: 500
  CONFIG_RUNTIME: {
    status: 'SERVER_ERROR',
  },

  // Internal error related to a specific format adapter
  // Extra:
  //  - adapter STR
  // HTTP status code: 500
  FORMAT: {
    status: 'SERVER_ERROR',
  },
  // Internal error related to a specific charset adapter
  // Extra:
  //  - adapter STR
  // HTTP status code: 500
  CHARSET: {
    status: 'SERVER_ERROR',
  },
  // Internal error related to a specific protocol adapter
  // Extra:
  //  - adapter STR
  // HTTP status code: 500
  PROTOCOL: {
    status: 'SERVER_ERROR',
  },
  // Internal error related to a specific rpc adapter
  // Extra:
  //  - adapter STR
  // HTTP status code: 500
  RPC: {
    status: 'SERVER_ERROR',
  },
  // Internal error related to a specific database adapter
  // Extra:
  //  - adapter STR
  // HTTP status code: 500
  DATABASE: {
    status: 'SERVER_ERROR',
  },
  // Internal error related to a specific log adapter
  // Extra:
  //  - adapter STR
  // HTTP status code: 500
  LOG: {
    status: 'SERVER_ERROR',
  },
  // Internal error related to a specific compress adapter
  // Extra:
  //  - adapter STR
  // HTTP status code: 500
  COMPRESS: {
    status: 'SERVER_ERROR',
  },
  // Internal error related to a specific plugin
  // Extra:
  //  - plugin STR
  // HTTP status code: 500
  PLUGIN: {
    status: 'SERVER_ERROR',
  },

  // Internal engine error
  // HTTP status code: 500
  ENGINE: {
    status: 'SERVER_ERROR',
  },
  // Internal uncaught error
  // HTTP status code: 500
  UNKNOWN: {
    status: 'SERVER_ERROR',
  },
};

// Get generic standard error properties, according to error reason
const getProps = function ({ error }) {
  const reason = getReason({ error });
  const props = PROPS[reason];
  return props;
};

// Get error reason
const getReason = function ({ error, error: { reason } = {} }) {
  if (error === undefined) { return 'SUCCESS'; }

  if (PROPS[reason] === undefined) { return 'UNKNOWN'; }

  return reason;
};

module.exports = {
  getProps,
  getReason,
};
/* eslint-enable max-lines */
