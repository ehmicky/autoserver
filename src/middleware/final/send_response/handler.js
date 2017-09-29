'use strict';

const { getStandardError } = require('../../../error');

const { validateResponse } = require('./validate');
const { types } = require('./types');
const { setEmptyResponse } = require('./empty');

// Sends the response at the end of the request
const sendResponse = function ({
  error,
  response,
  specific,
  protocolHandler,
  protocolStatus,
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

  const responseB = handler({
    content: contentB,
    protocolHandler,
    specific,
    protocolStatus,
  });

  return { response: responseB };
};

// Use protocol-specific way to send back the response to the client
const getErrorResponse = function ({ error, mInput, response }) {
  if (!error) { return response; }

  const errorA = getStandardError({ error, mInput, isLimited: false });

  return { type: 'error', content: { error: errorA } };
};

const transformContent = function ({
  content,
  type,
  operationHandler: { transformResponse } = {},
}) {
  const shouldTransform = transformResponse !== undefined &&
    transformTypes.includes(type);
  if (!shouldTransform) { return content; }

  return transformResponse(content);
};

const transformTypes = ['model', 'collection', 'error'];

module.exports = {
  sendResponse,
};
