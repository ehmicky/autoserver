'use strict';

const { getStandardError } = require('../../../error');
const { MODEL_TYPES, ERROR_TYPES } = require('../../../constants');

const { addMetadata } = require('./metadata');
const { validateResponse } = require('./validate');
const { send } = require('./send');

// Sends the response at the end of the request
const sendResponse = async function ({
  error,
  response,
  metadata,
  specific,
  protocolHandler,
  rpcHandler,
  format,
  compress,
  topargs,
  mInput,
}) {
  const responseA = getErrorResponse({ error, mInput, response });

  const responseB = addMetadata({ response: responseA, metadata });

  validateResponse({ response: responseB });

  const { type, content: responseC } = responseB;

  const content = transformContent({ response: responseB, mInput, rpcHandler });

  await send({
    protocolHandler,
    specific,
    content,
    // Response before transformation
    response: responseC,
    type,
    format,
    compress,
    topargs,
    error,
  });

  return { response: responseB };
};

// Use protocol-specific way to send back the response to the client
const getErrorResponse = function ({ error, mInput, response }) {
  if (!error) { return response; }

  const content = getStandardError({ error, mInput, isLimited: false });

  return { type: 'error', content };
};

const transformContent = function ({
  response,
  response: { type, content },
  mInput,
  rpcHandler: { transformError, transformSuccess } = {},
}) {
  if (ERROR_TYPES.includes(type) && transformError) {
    return transformError({ ...mInput, response });
  }

  if (MODEL_TYPES.includes(type) && transformSuccess) {
    return transformSuccess({ ...mInput, response });
  }

  return content;
};

module.exports = {
  sendResponse,
};
