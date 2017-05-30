'use strict';


const { cloneDeep } = require('lodash');

const { isDev } = require('../../utilities');
const transformMap = require('./transform');


// Creates protocol-independent response error, using an error object
const getResponse = function ({ error }) {
  error = cloneDeep(error);

  // Remove development-related information, but only for the response sent
  // to client, not the error sent reported by system (`errorObj`)
  if (!isDev()) {
    delete error.details;
  }

  let response = { type: 'error', content: error };

  // E.g. interface-specific error format, e.g. GraphQL
  const transformer = transformMap[error.interface];
  if (transformer) {
    //response = transformer.transformResponse({ response });
  }

  return response;
};


module.exports = {
  getResponse,
};
