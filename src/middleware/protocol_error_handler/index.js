'use strict';


const { httpProcessError } = require('./http');
const { processError } = require('../../error');


// Error handler adding protocol-related information to exceptions
const protocolErrorHandler = function () {
  return async function protocolErrorHandler(input) {
    try {
      const response = await this.next(input);
      return response;
    } catch (error) {
      const keyName = 'protocol';
      const { name: key, requestUrl: instance = 'unknown' } = input;
      const genericInfo = { instance };

      error = processError({
        error,
        input,
        keyName,
        key,
        processErrorMap,
        genericInfo,
      });
      throw error;
    }
  };
};

const processErrorMap = {
  http: httpProcessError,
};


module.exports = {
  protocolErrorHandler,
};
