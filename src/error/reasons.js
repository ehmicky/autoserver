'use strict';

// List of errors
// Keys are the exception.reason of the exception thrown
// Values are merged to exceptions thrown
//
// TODO: add `url` property pointing towards API documentation for that error
// TODO: add all `title` properties to `generic`
const errorReasons = {
  // Tried to use a protocol method that is not supported, e.g. TRACE
  UNSUPPORTED_METHOD: {},

  // Request payload has a Content-Length but no request payload
  NO_CONTENT_TYPE: {},

  // Query string is wrong
  QUERY_STRING_PARSE: {},

  // Input syntax error, e.g. GraphQL crashed trying to parse the raw query
  SYNTAX_VALIDATION: {},

  // General validation input errors, e.g. input data|filter does not
  // match IDL schema
  INPUT_VALIDATION: {},

  // Not allowed, authorization-wise
  AUTHORIZATION: {},

  // Standard 404, e.g. route not found
  NOT_FOUND: {},

  // A database model could not be found, e.g. incorrect id
  DATABASE_NOT_FOUND: {
    title: 'Model not found',
  },

  // Method is not supported, or most likely not allowed for this operation
  WRONG_METHOD: {},

  // The request took too long
  REQUEST_TIMEOUT: {},

  // A command conflicts with another one,
  // e.g. tries to create already existing model
  DATABASE_MODEL_CONFLICT: {},

  // Input is too big, e.g. args.data has too many items
  INPUT_LIMIT: {},

  // Request body Content-Type is unsupported
  WRONG_CONTENT_TYPE: {},

  // Filesystem error: could not open local file
  FILE_OPEN_ERROR: {},

  // IDL definition is syntactically invalid
  IDL_SYNTAX_ERROR: {},

  // IDL definition is semantically invalid
  IDL_VALIDATION: {},

  // Configuration options have syntax errors
  CONF_VALIDATION: {},

  // Loading of configuration failed
  CONF_LOADING: {},

  // Request did not pass IDL validation, e.g. `args` was not provided,
  // indicating a server bug
  INPUT_SERVER_VALIDATION: {},

  // Response did not pass IDL validation, e.g. if the database is corrupted
  // or new constraints were applied without being migrated
  OUTPUT_VALIDATION: {},

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
  return errorReasons[reason];
};

// Get error reason
const getReason = function ({ error: { reason = 'UNKNOWN' } }) {
  if (!errorReasons[reason]) { return 'UNKNOWN_TYPE'; }
  return reason;
};

module.exports = {
  getGenericProps,
  getReason,
};
