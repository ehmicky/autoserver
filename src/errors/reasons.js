/* eslint-disable max-lines */
'use strict';

// List of errors
// Keys are the exception.reason of the exception thrown
// Values are merged to exceptions thrown
// All error reasons and their related status
const PROPS = {
  // Request was successful, i.e. there is no error.
  SUCCESS: {
    status: 'SUCCESS',
  },

  // Wrong configuration caught during server startup.
  // Extra:
  //  - path 'VARR'
  //  - value VAL
  //  - suggestion VAL
  CONFIG_VALIDATION: {
    status: 'SERVER_ERROR',
  },

  // The request syntax or semantics is invalid.
  // Extra:
  //  - kind 'feature|protocol|rpc|argument|data|constraint'
  //  - path 'VARR'
  //  - suggestion VAL
  VALIDATION: {
    status: 'CLIENT_ERROR',
  },

  // The request is not authorized, i.e. not allowed to be performed.
  // Extra:
  //  - collection STR
  //  - ids STR_ARR
  AUTHORIZATION: {
    status: 'CLIENT_ERROR',
  },

  // The URL or route is invalid
  ROUTE: {
    status: 'CLIENT_ERROR',
  },
  // Some database models could not be found, e.g. the ids wre invalid.
  // Extra:
  //  - collection STR
  //  - ids STR_ARR
  NOT_FOUND: {
    status: 'CLIENT_ERROR',
    title: 'Model not found',
  },

  // The protocol method is unknown or invalid.
  // Extra:
  //  - suggestions STR_ARR
  METHOD: {
    status: 'CLIENT_ERROR',
  },
  // The command name is unknown or invalid.
  // Extra:
  //  - suggestions STR_ARR
  COMMAND: {
    status: 'CLIENT_ERROR',
  },

  // The response could not be serialized or content negotiation failed.
  // Extra:
  //  - kind 'compress|charset|format'
  RESPONSE_NEGOTIATION: {
    status: 'CLIENT_ERROR',
  },

  // The request took too much time to process.
  // Extra:
  //  - limit NUM
  TIMEOUT: {
    status: 'CLIENT_ERROR',
  },

  // Another client updated the same model, resulting in a conflict.
  // Extra:
  //  - collection STR
  //  - ids STR_ARR
  CONFLICT: {
    status: 'CLIENT_ERROR',
  },

  // The request payload's length must be specified
  NO_CONTENT_LENGTH: {
    status: 'CLIENT_ERROR',
  },

  // The request payload is too big.
  // Extra:
  //  - kind STR
  //  - value NUM
  //  - limit NUM
  PAYLOAD_LIMIT: {
    status: 'CLIENT_ERROR',
  },

  // The URL is too big.
  // Extra:
  //  - value NUM
  //  - limit NUM
  URL_LIMIT: {
    status: 'CLIENT_ERROR',
  },

  // The request payload could not be loaded, parsed or content negotiation
  // failed.
  // Extra:
  //  - kind 'parse|compress|charset|format'
  PAYLOAD_NEGOTIATION: {
    status: 'CLIENT_ERROR',
  },

  // Wrong configuration caught runtime.
  // Extra:
  //  - path 'VARR'
  //  - value VAL
  //  - suggestion VAL
  CONFIG_RUNTIME: {
    status: 'SERVER_ERROR',
  },

  // Internal error related to a specific format adapter
  // Extra:
  //  - adapter STR
  FORMAT: {
    status: 'SERVER_ERROR',
  },
  // Internal error related to a specific charset adapter
  // Extra:
  //  - adapter STR
  CHARSET: {
    status: 'SERVER_ERROR',
  },
  // Internal error related to a specific protocol adapter
  // Extra:
  //  - adapter STR
  PROTOCOL: {
    status: 'SERVER_ERROR',
  },
  // Internal error related to a specific rpc adapter
  // Extra:
  //  - adapter STR
  RPC: {
    status: 'SERVER_ERROR',
  },
  // Internal error related to a specific database adapter
  // Extra:
  //  - adapter STR
  DATABASE: {
    status: 'SERVER_ERROR',
  },
  // Internal error related to a specific log adapter
  // Extra:
  //  - adapter STR
  LOG: {
    status: 'SERVER_ERROR',
  },
  // Internal error related to a specific compress adapter
  // Extra:
  //  - adapter STR
  COMPRESS: {
    status: 'SERVER_ERROR',
  },
  // Internal error related to a specific plugin
  // Extra:
  //  - plugin STR
  PLUGIN: {
    status: 'SERVER_ERROR',
  },

  // Internal engine error
  ENGINE: {
    status: 'SERVER_ERROR',
  },
  // Internal uncaught error
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
