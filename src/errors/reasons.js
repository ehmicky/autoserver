/* eslint-disable max-lines */
'use strict';

// List of errors
// Keys are the exception.reason of the exception thrown
// Values are merged to exceptions thrown
// All error reasons and their related status
// TODO: add `url` property pointing towards API documentation for that error
// TODO: add all `title` properties to `generic`
const PROPS = {
  // No error
  SUCCESS: {
    status: 'SUCCESS',
  },

  // Config is invalid
  CONFIG_VALIDATION: {
    status: 'SERVER_ERROR',
  },

  // General validation input errors, e.g. input data|filter does not
  // match the config
  VALIDATION: {
    status: 'CLIENT_ERROR',
  },

  // Not allowed, authorization-wise
  AUTHORIZATION: {
    status: 'CLIENT_ERROR',
  },

  // Standard 404, e.g. route not found
  ROUTE: {
    status: 'CLIENT_ERROR',
  },

  // A database model could not be found, e.g. incorrect id
  NOT_FOUND: {
    status: 'CLIENT_ERROR',
    title: 'Model not found',
  },

  // Method is not supported, or most likely not allowed for this rpc
  // Or tried to use a protocol method that is not supported, e.g. TRACE
  METHOD: {
    status: 'CLIENT_ERROR',
  },

  // Invalid command, e.g. collection does not exist
  COMMAND: {
    status: 'CLIENT_ERROR',
  },

  // Wrong requested format|compress for the response payload
  RESPONSE_NEGOTIATION: {
    status: 'CLIENT_ERROR',
  },

  // The request took too long
  TIMEOUT: {
    status: 'CLIENT_ERROR',
  },

  // A command conflicts with another one,
  // e.g. tries to create already existing model
  CONFLICT: {
    status: 'CLIENT_ERROR',
  },

  // Request payload has a request payload but no Content-Length
  NO_CONTENT_LENGTH: {
    status: 'CLIENT_ERROR',
  },

  // Input is too big, e.g. args.data has too many items
  PAYLOAD_LIMIT: {
    status: 'CLIENT_ERROR',
  },

  // URL is too large
  URL_LIMIT: {
    status: 'CLIENT_ERROR',
  },

  // Wrong requested format|charset|compress for the request payload
  PAYLOAD_NEGOTIATION: {
    status: 'CLIENT_ERROR',
  },

  // Configuration error caught runtime
  CONFIG_RUNTIME: {
    status: 'SERVER_ERROR',
  },

  // Format adapter's error
  FORMAT: {
    status: 'SERVER_ERROR',
  },

  // Charset adapter's error
  CHARSET: {
    status: 'SERVER_ERROR',
  },

  // Protocol adapter's error
  PROTOCOL: {
    status: 'SERVER_ERROR',
  },

  // RPC adapter's error
  RPC: {
    status: 'SERVER_ERROR',
  },

  // Database error (not necessarily adapter's)
  DATABASE: {
    status: 'SERVER_ERROR',
  },

  // Log adapter's error
  LOG: {
    status: 'SERVER_ERROR',
  },

  // Compression adapter's error
  COMPRESS: {
    status: 'SERVER_ERROR',
  },

  // Plugin's error
  PLUGIN: {
    status: 'SERVER_ERROR',
  },

  // Internal error of the engine
  ENGINE: {
    status: 'SERVER_ERROR',
  },

  // General catch-all error
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
