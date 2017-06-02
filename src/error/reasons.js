'use strict';


/**
 * List of errors
 * Keys are the exception.reason of the exception thrown
 * Values are merged to exceptions thrown
 *
 * TODO: add `url` property pointing towards API documentation for that error
 * TODO: add all `title` properties to `generic`
 */
const errorReasons = {

  // Tried to query a protocol that is not supported, e.g. UDP
  UNSUPPORTED_PROTOCOL: {},

  // Tried to use a protocol method that is not supported, e.g. TRACE
  UNSUPPORTED_METHOD: {},

  // HTTP request body has a Content-Length but no request body
  HTTP_NO_CONTENT_TYPE: {},

  // HTTP query string is wrong
  HTTP_QUERY_STRING_PARSE: {},

  // Tried to query an interface that is not supported, e.g. SOAP
  UNSUPPORTED_INTERFACE: {},

  // HTTP request is trying to perform a GraphQL query,
  // but does not specify the query
  GRAPHQL_NO_QUERY: {},

  // GraphQL query syntax error, i.e. GraphQL crashed trying to parse
  // the raw query
  GRAPHQL_SYNTAX_ERROR: {},

  // General validation input errors, e.g. input data|filter does not
  // match IDL schema
  INPUT_VALIDATION: {},

  // Standard 404, e.g. route not found
  NOT_FOUND: {},

  // A database model could not be found, e.g. incorrect id
  DATABASE_NOT_FOUND: {
    title: 'Model not found',
  },

  // Command is not supported, or most likely not allowed for this model
  WRONG_COMMAND: {},

  // A command conflicts with another one,
  // e.g. tries to create already existing model
  DATABASE_MODEL_CONFLICT: {},

  // input is too big, e.g. arg.data has too many items
  INPUT_LIMIT: {},

  // HTTP request body Content-Type is unsupported
  HTTP_WRONG_CONTENT_TYPE: {},

  // Filesystem error: could not open local file
  FILE_OPEN_ERROR: {},

  // HTTP query string is wrong, but was created by the server
  HTTP_QUERY_STRING_SERIALIZE: {},

  // IDL definition is syntactically invalid
  IDL_SYNTAX_ERROR: {},

  // IDL definition is semantically invalid
  IDL_VALIDATION: {},

  // Main options have syntax errors
  OPTIONS_VALIDATION: {},

  // IDL definition is invalid, for usage with GraphQL
  GRAPHQL_WRONG_DEFINITION: {},

  // Introspection failed because of wrong schema
  GRAPHQL_WRONG_INTROSPECTION_SCHEMA: {},

  // GraphiQL HTML templating failed
  GRAPHIQL_PARSING_ERROR: {},

  // Request did not pass IDL validation, e.g. `args` was not provided,
  // indicating a server bug
  INPUT_SERVER_VALIDATION: {},

  // Response did not pass IDL validation, e.g. if the database is corrupted
  // or new constraints were applied without being migrated
  OUTPUT_VALIDATION: {},

  // No middleware was able to handle the response
  WRONG_RESPONSE: {},

  // Only one server can be running per process
  MULTIPLE_SERVERS: {},

  // Some utility got some wrong input
  UTILITY_ERROR: {},

  // Trying to throw an exception with the wrong signature
  WRONG_EXCEPTION: {},

  // The reason type is unknown
  UNKNOWN_TYPE: {},

  // General catch-all error
  UNKNOWN: {},

};

const getGenericProps = function ({ error }) {
  const reason = getReason({ error });
  return errorReasons[reason];
};

const getReason = function ({ error: { reason = 'UNKNOWN' } }) {
  if (!errorReasons[reason]) { return 'UNKNOWN_TYPE'; }
  return reason;
};


module.exports = {
  getGenericProps,
  getReason,
};
