'use strict';


const { chain } = require('lodash');

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
  const interfaceErrorHandler = interfaceErrorHandlers[interf];

  // Retrieves protocol-independent error information, using the thrown exception
  const genericErrorInput = getErrorInfo({ exception });
  let error = createError({ exception, errorInput: genericErrorInput });

  // Adds protocol-specific error information
  const protocolErrorInput = Object.assign({}, input, getErrorInfo({ exception, protocol }));
  error = protocolErrorHandler.processError({ error, errorInput: protocolErrorInput });

  // Adds interface-specific error information
  if (interfaceErrorHandler) {
    error = interfaceErrorHandler.processError({ error });
  }

  error = sortErrorKeys({ error });

  // Use protocol-specific way to send back the error
  protocolErrorHandler.sendError({ error, input });
  console.error(error);
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
const createError = function ({ exception, errorInput }) {
  const message = typeof exception === 'string' ? exception : exception.message;

  const newError = {
    type: exception.reason,
    title: errorInput.title,
    // Long description
    description: message || errorInput.description,
  };

  // Not in production
  if (isDev()) {
    Object.assign(newError, {
      // Recrursive stack trace
      details: (exception.innererror && exception.innererror.stack) || exception.stack,
    });
  }

  // Any custom information
  Object.assign(newError, exception.extra);

  return newError;
};

const sortedKeys = ['status', 'type', 'title', 'description', 'instance', 'details'];
const sortErrorKeys = function ({ error }) {
  return chain(error)
    .toPairs()
    .sortBy(([key]) => {
      let index = sortedKeys.indexOf(key);
      if (index === -1) {
        index = sortedKeys.length;
      }
      return index;
    })
    .fromPairs()
    .value();
};


module.exports = {
  sendError,
};
