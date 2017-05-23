'use strict';


const { graphqlTransformResponse } = require('./graphql');
const { processError } = require('../../../error');


// Error handler adding interface-related information to exceptions
const interfaceErrorHandler = function () {
  return async function interfaceErrorHandler(input) {
    try {
      const response = await this.next(input);
      return response;
    } catch (error) {
      const keyName = 'interface';
      const key = input.interface;

      error = processError({
        error,
        input,
        keyName,
        key,
        transformResponseMap,
      });
      throw error;
    }
  };
};

const transformResponseMap = {
  graphql: graphqlTransformResponse,
};


module.exports = {
  interfaceErrorHandler,
};
