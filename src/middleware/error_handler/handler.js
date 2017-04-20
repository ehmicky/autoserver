'use strict';


const { console, isDev } = require('../../utilities');
const { getErrorInfo } = require('./reasons');
const protocolErrorHandlers = require('./protocol');
const interfaceErrorHandlers = require('./interface');


/**
 * Sends error back to client
 *
 * @param {object} options
 * @param {Error} options.exception
 * @param {object} options.input - protocol-independent request/response object
 * @param {string} options.protocol - e.g. 'http'
 */
const sendError = () => function ({ exception, input, info: { protocol, interface: interf } }) {
  const protocolErrorHandler = protocolErrorHandlers[protocol];
  // Retrieves request URL, protocol-specific
  const requestUrl = protocolErrorHandler.getRequestUrl({ input }) || 'unknown';
  // Retrieves protocol-independent error information, using the thrown exception
  const genericErrorInput = getErrorInfo({ exception });
  const genericError = createError({ exception, error: genericErrorInput, requestUrl });

  // Adds protocol-specific error information
  const protocolErrorInput = getErrorInfo({ exception, protocol });
  const protocolError = protocolErrorHandler.createError({ error: genericError, protocolError: protocolErrorInput });

  // Adds interface-specific error information
  const interfaceErrorHandler = interfaceErrorHandlers[interf];
  const interfaceError =
    interfaceErrorHandler ? interfaceErrorHandler.createError({ error: protocolError }) : protocolError;

  // Any custom information
  Object.assign(interfaceError, exception.extra);

  // Use protocol-specific way to send back the error
  protocolErrorHandler.sendError({ error: interfaceError, input });
  console.error(interfaceError);
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

  const newError = {
    type: exception.reason,
    title: error.title,
    // Long description
    description: message || error.description,
    // Request URL, i.e. everything except query string and hash
    instance: requestUrl,
  };

  // Not in production
  if (isDev()) {
    Object.assign(newError, {
      // Recrursive stack trace
      details: (exception.innererror && exception.innererror.stack) || exception.stack,
    });
  }

  return newError;
};


module.exports = {
  sendError,
};
