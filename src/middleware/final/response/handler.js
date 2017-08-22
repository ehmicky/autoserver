'use strict';

const {
  getStandardError,
  normalizeError,
  rethrowError,
} = require('../../../error');
const { addReqInfo } = require('../../../events');

const { sender } = require('./sender');
const transformMap = require('./transform');

// Sends the response at the end of the request
const sendResponse = async function (nextFunc, input) {
  try {
    const inputA = await nextFunc(input);

    const { response: { content, type } } = inputA;
    addReqInfo(inputA, { response: { content, type } });

    await sender({ input: inputA });

    return inputA;
  } catch (error) {
    const errorA = normalizeError({ error });

    const inputA = getErrorResponse({ input, error: errorA });
    await sender({ input: inputA });

    rethrowError(errorA);
  }
};

// Use protocol-specific way to send back the response to the client
const getErrorResponse = function ({ input, input: { reqInfo }, error }) {
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
