'use strict';


const { getErrorType } = require('./error_types');
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
