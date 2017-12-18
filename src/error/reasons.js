/* eslint-disable max-lines */
'use strict';

// List of errors
// Keys are the exception.reason of the exception thrown
// Values are merged to exceptions thrown
// All error reasons and their related status
// TODO: add `url` property pointing towards API documentation for that error
// TODO: add all `title` properties to `generic`
const PROPS = {
  // Config is invalid
  CONF_VALIDATION: {
    status: 'SERVER_ERROR',
  },

  // No error
  SUCCESS: {
    status: 'SUCCESS',
  },

  // Error while parsing the request payload
  PAYLOAD_PARSE: {
    status: 'CLIENT_ERROR',
  },

  // Query string is wrong
  QUERY_STRING_PARSE: {
    status: 'CLIENT_ERROR',
  },

  // Input syntax error, e.g. GraphQL crashed trying to parse the raw query
  SYNTAX_VALIDATION: {
    status: 'CLIENT_ERROR',
  },

  // General validation input errors, e.g. input data|filter does not
  // match the config
  INPUT_VALIDATION: {
    status: 'CLIENT_ERROR',
  },

  // The client try to perform an action not supported by the specific
  // collection, i.e. its database adapters is too limited
  WRONG_FEATURE: {
    status: 'CLIENT_ERROR',
  },

  // The request is over limits related to pagination or action nesting
  REQUEST_LIMIT: {
    status: 'CLIENT_ERROR',
  },

  // Not allowed, authorization-wise
  AUTHORIZATION: {
    status: 'CLIENT_ERROR',
  },

  // Standard 404, e.g. route not found
  ROUTE_NOT_FOUND: {
    status: 'CLIENT_ERROR',
  },

  // A database model could not be found, e.g. incorrect id
  DB_MODEL_NOT_FOUND: {
    status: 'CLIENT_ERROR',
    title: 'Model not found',
  },

  // Method is not supported, or most likely not allowed for this rpc
  // Or tried to use a protocol method that is not supported, e.g. TRACE
  WRONG_METHOD: {
    status: 'CLIENT_ERROR',
  },

  // Invalid command, e.g. collection does not exist
  WRONG_COMMAND: {
    status: 'CLIENT_ERROR',
  },

  // Wrong requested format|compress for the response payload
  RESPONSE_FORMAT: {
    status: 'CLIENT_ERROR',
  },

  // The request took too long
  REQUEST_TIMEOUT: {
    status: 'CLIENT_ERROR',
  },

  // A command conflicts with another one,
  // e.g. tries to create already existing model
  DB_CONFLICT: {
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
  REQUEST_FORMAT: {
    status: 'CLIENT_ERROR',
  },

  // Configuration error caught runtime
  CONF_RUNTIME: {
    status: 'SERVER_ERROR',
  },

  // Error while starting or stopping a protocol server
  PROTOCOL: {
    status: 'SERVER_ERROR',
  },

  // Error during RPC handling
  RPC: {
    status: 'SERVER_ERROR',
  },

  // Error while connecting, disconnecting or communicating with a database
  DATABASE: {
    status: 'SERVER_ERROR',
  },

  // An exception was fired on the process itself
  PROCESS: {
    status: 'SERVER_ERROR',
  },

  // An exception was fired during logging
  LOG: {
    status: 'SERVER_ERROR',
  },

  // Error during compression or decompression adapter
  COMPRESS: {
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
