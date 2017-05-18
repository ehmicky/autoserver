'use strict';


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
const sendError = function ({ onRequestError = () => {} }) {
  return function sendErrorFunc({ exception, input = {}, retry = false }) {
    const { interface: interf } = input.info;
    const { protocol } = input;
    try {
      const protocolErrorHandler = protocolErrorHandlers[protocol.name];
      const interfaceErrorHandler = interfaceErrorHandlers[interf];

      if (typeof exception === 'string') {
        exception = { message: exception };
      }

      // Retrieves protocol-independent error information,
      // using the thrown exception
      const genericErrorInput = getErrorInfo({ exception });
      let response = createResponse({
        exception,
        errorInput: genericErrorInput,
      });

      // Adds protocol-specific error information
      if (protocolErrorHandler) {
        const errorInfo = getErrorInfo({ exception, protocol });
        const protocolErrorInput = Object.assign({}, input, errorInfo);
        response = protocolErrorHandler.processResponse({
          response,
          errorInput: protocolErrorInput,
        });
      }

      // Adds interface-specific error information
      if (interfaceErrorHandler) {
        response = interfaceErrorHandler.processResponse({ response });
      }

      response.error = sortResponseKeys({ error: response.error });

      // Use protocol-specific way to send back the response
      if (protocolErrorHandler) {
        protocolErrorHandler.sendResponse({ response, input });
      }
      log.error(response.error);
      onRequestError(response.error);
    // Retries once if it fails
    } catch (innererror) {
      const errorHandlerError = new ErrorHandlerError('Error handler failed', {
        reason: 'ERROR_HANDLER_FAILURE',
        innererror,
      });
      log.error(errorHandlerError);
      onRequestError(errorHandlerError);
      if (retry) { return; }
      sendErrorFunc({
        exception: innererror,
        input: {
          protocol: input.protocol,
          info: {},
        },
        retry: true,
      });
    }
  };
};

// Creates protocol-independent response error
const createResponse = function ({
  errorInput: { title, description: errorDescription },
  exception: {
    message: description = errorDescription,
    reason: type,
    stack,
    innererror: { stack: details = stack } = {},
    extra,
  },
}) {
  const error = { type, description };
  if (title) {
    Object.assign(error, { title });
  }
  // Not in production
  if (isDev()) {
    Object.assign(error, { details });
  }
  // Any custom information
  Object.assign(error, extra);

  // See RFC 7807
  const contentType = 'application/problem+json';
  const response = { error, contentType };

  return response;
};

const sortResponseKeys = function ({ error }) {
  return Object.entries(error)
    .sort(([a], [b]) => {
      if (!sortedKeys.includes(a)) { return 1; }
      if (!sortedKeys.includes(b)) { return -1; }
      return sortedKeys.indexOf(a) > sortedKeys.indexOf(b) ? 1 : -1;
    })
    .reduce((obj, [key, value]) => Object.assign(obj, { [key]: value }), {});
};
const sortedKeys = [
  'status',
  'type',
  'title',
  'description',
  'instance',
  'details',
];


module.exports = {
  sendError,
};
