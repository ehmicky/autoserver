'use strict';

const { getStandardError } = require('../../../error');
const { addReqInfo } = require('../../../events');

const { sender } = require('./sender');
const transformMap = require('./transform');

// Sends the response at the end of the request
const sendResponse = function (input) {
  const inputA = addResponseInfo({ input });
  const inputB = getErrorResponse({ input: inputA });

  sender({ input: inputB });

  return inputB;
};

const addResponseInfo = function ({
  input,
  input: { error, response: { content, type } = {} },
}) {
  if (error) { return input; }

  const inputA = addReqInfo(input, { response: content, responseType: type });

  return inputA;
};

// Use protocol-specific way to send back the response to the client
const getErrorResponse = function ({ input, input: { reqInfo, error } }) {
  if (!error) { return input; }

  const errorA = getStandardError({ error, reqInfo });
  const response = createErrorResponse({ input, error: errorA });
  return { ...input, response };
};

// Creates protocol-independent response error, using an error object
const createErrorResponse = function ({ input: { operation }, error }) {
  const response = { type: 'error', content: error };

  // E.g. operation-specific error format, e.g. GraphQL
  const transformer = transformMap[operation];

  if (transformer) {
    return transformer.transformResponse({ response });
  }

  return response;
};

module.exports = {
  sendResponse,
};
