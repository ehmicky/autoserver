'use strict';


const errorHandler = {
  http: require('./http'),
};


/**
 * Sends error back to client
 *
 * @param exception {Error}
 * @param input {object} protocol-independent request/response object
 * @param protocol {string} e.g. 'http'
 */
const sendError = function ({ exception, input, protocol }) {
  // Retrieves request URL, protocol-specific
  const requestUrl = errorHandler[protocol].getRequestUrl({ input });
  // Retrieves protocol-independent error information, using the thrown exception
  const genericErrorInput = getErrorType({ exception });
  const genericError = createError({ exception, error: genericErrorInput, requestUrl });

  // Adds protocol-specific error information
  const protocolErrorInput = getErrorType({ exception, protocol });
  const protocolError = errorHandler[protocol].createError({ exception, error: genericError, protocolError: protocolErrorInput });

  // Use protocol-specific way to send back the error
  errorHandler[protocol].sendError({ error: protocolError, input });
};

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

  // Standard 404, e.g. route not found
  NOT_FOUND: () => ({
    http: { status: 404 },
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

/**
 * Creates protocol-independent error, ready for output
 *
 * @param exception {Error}
 * @param requestUrl {string}
 *
 * @returns error {object}
 */
const createError = function ({ exception, error, requestUrl }) {
  const message = typeof exception === 'string' ? exception : exception.message;

  return {
    type: exception.reason,
    title: error.title,
    // Long description
    description: error.description || message,
    // Request URL, i.e. everything except query string and hash
    instance: requestUrl,
    // Stack trace, not printed in production
    details: exception.stack,
  };
};


module.exports = {
  sendError,
};
