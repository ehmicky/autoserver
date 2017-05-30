'use strict';


const { processError } = require('../../../error');
const { httpProcessError } = require('./http');


// Error handler adding protocol-related information to exceptions
const protocolErrorHandler = function () {
  return async function protocolErrorHandler(input) {
    try {
      const response = await this.next(input);
      return response;
    } catch (error) {
      const keyName = 'protocol';
      const { protocol: key, url: instance = 'unknown' } = input;
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
