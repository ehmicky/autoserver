'use strict';

const { getStandardError } = require('../../../error');
const { MODEL_TYPES, ERROR_TYPES } = require('../../../constants');

const { validateResponse } = require('./validate');
const { types } = require('./types');
const { setEmptyResponse } = require('./empty');

// Sends the response at the end of the request
const sendResponse = async function ({
  error,
  response,
  specific,
  protocolHandler,
  protocolstatus,
  rpcHandler,
  topargs,
  mInput,
}) {
  const responseA = getErrorResponse({ error, mInput, response });

  validateResponse({ response: responseA });

  const content = transformContent({ response: responseA, mInput, rpcHandler });

  const { type } = responseA;
  const { handler, emptyResponse } = types[type];

  const contentB = setEmptyResponse({ content, topargs, error, emptyResponse });

  await handler({
    content: contentB,
    protocolHandler,
    specific,
    protocolstatus,
  });

  const responseheaders = protocolHandler.getResponseheaders({ specific });

  return { response: responseA, responseheaders };
};

// Use protocol-specific way to send back the response to the client
const getErrorResponse = function ({ error, mInput, response }) {
  if (!error) { return response; }

  const errorA = getStandardError({ error, mInput, isLimited: false });

  return { type: 'error', content: { error: errorA } };
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
