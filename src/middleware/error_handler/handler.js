'use strict';


const { chain } = require('lodash');

const { ErrorHandlerError } = require('../../error');
const { log, isDev } = require('../../utilities');
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
const sendError = ({ onRequestError = () => {} }) => {
  const sendErrorFunc = function ({ exception, input = {}, info: { protocol, interface: interf } = {}, retry = false }) {
    try {
      const protocolErrorHandler = protocolErrorHandlers[protocol];
      const interfaceErrorHandler = interfaceErrorHandlers[interf];

      // Retrieves protocol-independent error information, using the thrown exception
      const genericErrorInput = getErrorInfo({ exception });
      let response = createResponse({ exception, errorInput: genericErrorInput });

      // Adds protocol-specific error information
      const protocolErrorInput = Object.assign({}, input, getErrorInfo({ exception, protocol }));
      response = protocolErrorHandler.processResponse({ response, errorInput: protocolErrorInput });

      // Adds interface-specific error information
      if (interfaceErrorHandler) {
        response = interfaceErrorHandler.processResponse({ response });
      }

      response = sortResponseKeys({ response });

      // Use protocol-specific way to send back the response
      protocolErrorHandler.sendResponse({ response, input });
      log.error(response.error);
      onRequestError(response.error);
    // Retries once if it fails
    } catch (innererror) {
      const errorHandlerError = new ErrorHandlerError('Error handler failed', { reason: 'ERROR_HANDLER_FAILURE', innererror });
      log.error(errorHandlerError);
      onRequestError(errorHandlerError);
      if (retry) { return; }
      sendErrorFunc({ exception: innererror, input, info: { protocol }, retry: true });
    }
  };
  return sendErrorFunc;
};

// Creates protocol-independent response error
const createResponse = function ({ exception, errorInput }) {
  const message = typeof exception === 'string' ? exception : exception.message;

  const response = {
    error: {
      type: exception.reason,
      title: errorInput.title,
      // Long description
      description: message || errorInput.description,
    },
    // See RFC 7807
    contentType: 'application/problem+json',
  };

  // Not in production
  if (isDev()) {
    Object.assign(response.error, {
      // Recrursive stack trace
      details: (exception.innererror && exception.innererror.stack) || exception.stack,
    });
  }

  // Any custom information
  Object.assign(response.error, exception.extra);

  return response;
};

const sortedKeys = ['status', 'type', 'title', 'description', 'instance', 'details'];
const sortResponseKeys = function ({ response }) {
  response.error = chain(response.error)
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
  return response;
};


module.exports = {
  sendError,
};
