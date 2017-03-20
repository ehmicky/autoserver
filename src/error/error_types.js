'use strict';


/**
 * List of errors
 * Keys are the exception.type of the exception thrown
 * Returns:
 *  - [status] {number} HTTP status, defaults to 500
 *  - [title] {string} short description, defaults to standard HTTP status code's
 *  - [description] {string} long description, defaults to exception message
 * Returns value is specific to each protocol (using first-level key), but key `any` means any protocol
 *
 * @param input {object}
 * @param input.exception {Error}
 * @returns error_message {object}
 *
 * TODO: add `url` property pointing towards API documentation for that error
 */
const errorTypes = {

  // HTTP request body has a Content-Length but no request body
  HTTP_NO_CONTENT_TYPE: () => ({
    http: { status: 400 },
  }),

  // HTTP query string is wrong
  HTTP_QUERY_STRING_PARSE: () => ({
    http: { status: 400 },
  }),

  // HTTP request is trying to perform a GraphQL query, but does not specify the query
  GRAPHQL_NO_QUERY: () => ({
    http: { status: 400 },
  }),

  // Standard 404, e.g. route not found
  NOT_FOUND: () => ({
    http: { status: 404 },
  }),

  // HTTP request body Content-Type is unsupported
  HTTP_WRONG_CONTENT_TYPE: () => ({
    http: { status: 415 },
  }),

  // HTTP query string is wrong, but was created by the server
  HTTP_QUERY_STRING_SERIALIZE: () => ({
    http: { status: 500 },
  }),

  // GraphQL schema is invalid
  GRAPHQL_WRONG_SCHEMA: () => ({
    http: { status: 500 },
  }),

  // No middleware was able to handle the response
  NO_RESPONSE: () => ({
    http: { status: 500 },
  }),

  // General catch-all error
  UNKNOWN: () => ({
    http: { status: 500 },
  }),

};

// Searches through `errorTypes`
const getErrorType = function ({ exception, protocol = 'any' }) {
  const errorType = errorTypes[exception.reason] || errorTypes.UNKNOWN;
  const error = errorType({ exception })[protocol] || {};
  return error;
};


module.exports = {
  getErrorType,
};
