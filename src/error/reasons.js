'use strict';

// List of errors
// Keys are the exception.reason of the exception thrown
// Values are merged to exceptions thrown
//
// TODO: add `url` property pointing towards API documentation for that error
// TODO: add all `title` properties to `generic`
const ERROR_REASONS = {
  // Error while parsing the request payload
  PAYLOAD_PARSE: {},

  // Query string is wrong
  QUERY_STRING_PARSE: {},

  // Input syntax error, e.g. GraphQL crashed trying to parse the raw query
  SYNTAX_VALIDATION: {},

  // General validation input errors, e.g. input data|filter does not
  // match the schema
  INPUT_VALIDATION: {},

  // Method is not supported, or most likely not allowed for this rpc
  // Or tried to use a protocol method that is not supported, e.g. TRACE
  WRONG_METHOD: {},

  // The client try to perform an action not supported by the specific model,
  // i.e. its database adapters is too limited
  WRONG_FEATURE: {},

  // Not allowed, authorization-wise
  AUTHORIZATION: {},

  // Standard 404, e.g. route not found
  ROUTE_NOT_FOUND: {},

  // A database model could not be found, e.g. incorrect id
  DB_MODEL_NOT_FOUND: {
    title: 'Model not found',
  },

  // The request took too long
  REQUEST_TIMEOUT: {},

  // A command conflicts with another one,
  // e.g. tries to create already existing model
  DB_CONFLICT: {},

  // Request payload has a request payload but no Content-Length
  NO_CONTENT_LENGTH: {},

  // Input is too big, e.g. args.data has too many items
  INPUT_LIMIT: {},

  // URL is too large
  URL_LIMIT: {},

  // Request body Content-Type is unsupported
  // Or request payload has a request payload but no Content-Type
  WRONG_CONTENT_TYPE: {},

  // Filesystem error: could not open local file
  FILE_OPEN_ERROR: {},

  // Schema is syntactically invalid
  SCHEMA_SYNTAX_ERROR: {},

  // Schema is semantically invalid
  SCHEMA_VALIDATION: {},

  // Configuration options have syntax errors
  CONF_VALIDATION: {},

  // Loading of configuration failed
  CONF_LOADING: {},

  // Request did not pass schema validation, e.g. `args` was not provided,
  // indicating a server bug
  INPUT_SERVER_VALIDATION: {},

  // Response did not pass schema validation, e.g. if the database is corrupted
  // or new constraints were applied without being migrated
  OUTPUT_VALIDATION: {},

  // Error while starting or stopping a protocol server
  PROTOCOL_ERROR: {},

  // Error while connecting, disconnecting or communicating with a database
  DB_ERROR: {},

  // An exception was fired on the process itself
  PROCESS_ERROR: {},

  // An exception was fired during an event handler
  EVENT_ERROR: {},

  // Some utility got some wrong input
  UTILITY_ERROR: {},

  // The reason type is unknown
  UNKNOWN_TYPE: {},

  // General catch-all error
  UNKNOWN: {},

};

// Get generic standard error properties, according to error reason
const getGenericProps = function ({ error }) {
  const reason = getReason({ error });
  return ERROR_REASONS[reason];
};

// Get error reason
const getReason = function ({ error: { reason = 'UNKNOWN' } }) {
  if (!ERROR_REASONS[reason]) { return 'UNKNOWN_TYPE'; }
  return reason;
};

module.exports = {
  getGenericProps,
  getReason,
};
