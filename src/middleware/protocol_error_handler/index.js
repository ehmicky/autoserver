'use strict';


const { defaultsDeep } = require('lodash');

const { getErrorReason } = require('../../error');
const { httpProcessError } = require('./http');


// Error handler adding protocol-related information to exceptions,
const protocolErrorHandler = function () {
  return async function protocolErrorHandler(input) {
    try {
      const response = await this.next(input);
      return response;
    } catch (error) {
      throw processError({ error, input });
    }
  };
};

const processError = function ({ error, input }) {
  const {
    protocol: {
      name: protocol,
      requestUrl: instance = 'unknown',
    },
  } = input;

  if (!(error instanceof Error)) {
    error = new Error(String(error));
  }

  // Apply reason-specific protocol-related information
  const { protocol: protocolInfo = {} } = getErrorReason({ error });
  const specificInfo = protocolInfo[protocol];
  defaultsDeep(error, specificInfo);

  // Apply protocol-specific information
  const protocolProcessError = processErrorMap[protocol];
  if (protocolProcessError) {
    protocolProcessError({ error, input });
  }

  // Apply generic protocol-related information
  const genericInfo = { instance, extra: { protocol } };
  defaultsDeep(error, genericInfo);

  return error;
};

const processErrorMap = {
  http: httpProcessError,
};


module.exports = {
  protocolErrorHandler,
};
