'use strict';


const { processError } = require('../../../error');


// Error handler adding protocol-related information to exceptions
const protocolErrorHandler = function () {
  return async function protocolErrorHandler(input) {
    try {
      const response = await this.next(input);
      return response;
    } catch (error) {
      const keyName = 'protocol';
      const {
        protocol: key,
        protocolMethod,
        url: instance = 'unknown',
      } = input;
      const genericInfo = {
        instance,
        extra: { protocol_method: protocolMethod },
      };

      error = processError({
        error,
        input,
        keyName,
        key,
        genericInfo,
      });
      throw error;
    }
  };
};


module.exports = {
  protocolErrorHandler,
};
