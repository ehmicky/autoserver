'use strict';


/**
 * List of errors
 * Keys are the exception.reason of the exception thrown
 * Returns:
 *  - [status] {number} HTTP status, defaults to 500
 *  - [title] {string} short description, defaults to standard HTTP status code's
 *  - [description] {string} long description, defaults to exception message
 * Returns value is specific to each protocol (using first-level key), but key `any` means any protocol
 *
 * @param {object} input
 * @param {Error} input.exception
 * @returns {object} error_message
 *
 * TODO: add `url` property pointing towards API documentation for that error
 */
const errorReasons = {

  // Tried to query a protocol that is not supported, e.g. UDP
  UNSUPPORTED_PROTOCOL: () => ({
    http: { status: 400 },
  }),

  // HTTP request body has a Content-Length but no request body
  HTTP_NO_CONTENT_TYPE: () => ({
    http: { status: 400 },
  }),

  // HTTP query string is wrong
  HTTP_QUERY_STRING_PARSE: () => ({
    http: { status: 400 },
  }),

  // Tried to query an interface that is not supported, e.g. SOAP
  UNSUPPORTED_INTERFACE: () => ({
    http: { status: 400 },
  }),

  // HTTP request is trying to perform a GraphQL query, but does not specify the query
  GRAPHQL_NO_QUERY: () => ({
    http: { status: 400 },
  }),

  // GraphQL query syntax error, i.e. GraphQL crashed trying to parse the raw query
  GRAPHQL_SYNTAX_ERROR: () => ({
    http: { status: 400 },
  }),

  // General validation input errors, e.g. input data|filter does not match IDL schema
  INPUT_VALIDATION: () => ({
    http: { status: 400 },
  }),

  // Standard 404, e.g. route not found
  NOT_FOUND: () => ({
    http: { status: 404 },
  }),

  // A database model could not be found, e.g. incorrect id
  DATABASE_NOT_FOUND: () => ({
    http: { status: 404 },
  }),

  // A database model operation conflicts with another one, e.g. tries to create already existing model
  DATABASE_MODEL_CONFLICT: () => ({
    http: { status: 409 },
  }),

  // HTTP request body Content-Type is unsupported
  HTTP_WRONG_CONTENT_TYPE: () => ({
    http: { status: 415 },
  }),

  // Filesystem error: could not open local file
  FILE_OPEN_ERROR: () => ({
    http: { status: 500 },
  }),

  // HTTP query string is wrong, but was created by the server
  HTTP_QUERY_STRING_SERIALIZE: () => ({
    http: { status: 500 },
  }),

  // IDL definition is syntactically invalid
  IDL_SYNTAX_ERROR: () => ({
    http: { status: 500 },
  }),

  // IDL definition is semantically invalid
  IDL_VALIDATION: () => ({
    http: { status: 500 },
  }),

  // IDL definition is invalid, for usage with GraphQL
  GRAPHQL_WRONG_DEFINITION: () => ({
    http: { status: 500 },
  }),

  // GraphiQL HTML templating failed
  GRAPHIQL_PARSING_ERROR: () => ({
    http: { status: 500 },
  }),

  // Request did not pass IDL validation, e.g. `args` was not provided, indicated a server bug
  INPUT_SERVER_VALIDATION: () => ({
    http: { status: 500 },
  }),

  // Response did not pass IDL validation, e.g. if the database is corrupted or new constraints were applied without
  // being migrated
  OUTPUT_VALIDATION: () => ({
    http: { status: 500 },
  }),

  // No middleware was able to handle the response
  WRONG_RESPONSE: () => ({
    http: { status: 500 },
  }),

  // General catch-all error
  UNKNOWN: () => ({
    http: { status: 500 },
  }),

};

// Searches through `errorReasons`
const getErrorInfo = function ({ exception, protocol = 'any' }) {
  const errorInfo = errorReasons[exception.reason] || errorReasons.UNKNOWN;
  const error = errorInfo({ exception })[protocol] || {};
  return error;
};


module.exports = {
  getErrorInfo,
};
