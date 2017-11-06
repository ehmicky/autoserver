'use strict';

const { getStandardError } = require('../../../error');
const { MODEL_TYPES } = require('../../../constants');

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
  operationHandler,
  topArgs,
  mInput,
}) {
  const responseA = getErrorResponse({ error, mInput, response });

  validateResponse({ response: responseA });

  const { type, content } = responseA;

  const contentA = transformContent({ content, type, operationHandler });

  const { handler, emptyResponse } = types[type];

  const contentB = setEmptyResponse({
    content: contentA,
    topArgs,
    error,
    emptyResponse,
  });

  await handler({
    content: contentB,
    protocolHandler,
    specific,
    protocolstatus,
  });

  const responseHeaders = protocolHandler.getResponseHeaders({ specific });

  return { response: responseA, responseHeaders };
};

// Use protocol-specific way to send back the response to the client
const getErrorResponse = function ({ error, mInput, response }) {
  if (!error) { return response; }

  const errorA = getStandardError({ error, mInput, isLimited: false });

  return { type: 'error', content: { data: errorA } };
};

const transformContent = function ({
  content,
  type,
  operationHandler: { transformResponse } = {},
}) {
  const shouldTransform = transformResponse !== undefined &&
    MODEL_TYPES.includes(type);
  if (!shouldTransform) { return content; }

  return transformResponse({ content, type });
};

module.exports = {
  sendResponse,
};
