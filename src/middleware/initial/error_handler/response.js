'use strict';


const { cloneDeep } = require('lodash');

const transformMap = require('./transform');


// Creates protocol-independent response error, using an error object
const getResponse = function ({ error }) {
  const content = cloneDeep(error);
  let response = { type: 'error', content };

  // E.g. operation-specific error format, e.g. GraphQL
  const transformer = transformMap[error.operation];
  if (transformer) {
    response = transformer.transformResponse({ response });
  }

  return response;
};


module.exports = {
  getResponse,
};
