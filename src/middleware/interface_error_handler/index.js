'use strict';


const { defaultsDeep } = require('lodash');

const { getErrorReason } = require('../../error');
const { graphqlTransformResponse } = require('./graphql');


// Error handler adding interface-related information to exceptions
const interfaceErrorHandler = function () {
  return async function interfaceErrorHandler(input) {
    try {
      const response = await this.next(input);
      return response;
    } catch (error) {
      throw processError({ error, input });
    }
  };
};

const processError = function ({ error, input }) {
  const { info: { interface: interf } } = input;

  if (!(error instanceof Error)) {
    error = new Error(String(error));
  }

  // Apply reason-specific interface-related information
  const { interface: info = {} } = getErrorReason({ error });
  const specificInfo = info[interf];
  defaultsDeep(error, specificInfo);

  // Apply interface-specific information
  const interfaceProcessError = processErrorMap[interf];
  if (interfaceProcessError) {
    interfaceProcessError({ error, input });
  }

  // Apply generic interface-related information
  const genericInfo = { extra: { interface: interf } };
  defaultsDeep(error, genericInfo);

  const transformResponse = transformResponseMap[interf];
  if (transformResponse) {
    error.transforms = error.transforms || [];
    error.transforms.push(transformResponse);
  }

  return error;
};

const processErrorMap = {};

const transformResponseMap = {
  graphql: graphqlTransformResponse,
};


module.exports = {
  interfaceErrorHandler,
};
