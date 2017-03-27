'use strict';


const { console } = require('../../utilities');
const { getErrorInfo } = require('./reasons');
const errorHandler = {
  http: require('./http'),
};


/**
 * Sends error back to client
 *
 * @param {object} options
 * @param {Error} options.exception
 * @param {object} options.input - protocol-independent request/response object
 * @param {string} options.protocol - e.g. 'http'
 */
const sendError = () => function ({ exception, input, protocol }) {
  // Retrieves request URL, protocol-specific
  const requestUrl = errorHandler[protocol].getRequestUrl({ input });
  // Retrieves protocol-independent error information, using the thrown exception
  const genericErrorInput = getErrorInfo({ exception });
  const genericError = createError({ exception, error: genericErrorInput, requestUrl });

  // Adds protocol-specific error information
  const protocolErrorInput = getErrorInfo({ exception, protocol });
  const protocolError = errorHandler[protocol].createError({ exception, error: genericError, protocolError: protocolErrorInput });

  // Use protocol-specific way to send back the error
  errorHandler[protocol].sendError({ error: protocolError, input });
  console.error(protocolError);
};

/**
 * Creates protocol-independent error, ready for output
 *
 * @param {object} options
 * @param {Error} options.exception
 * @param {string} options.requestUrl
 *
 * @returns {object} error
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
    details: (exception.innererror && exception.innererror.stack) || exception.stack,
  };
};


module.exports = {
  sendError,
};