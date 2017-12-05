'use strict';

const { omit } = require('../../../utilities');
const { getStandardError } = require('../../../error');
const { MODEL_TYPES, ERROR_TYPES } = require('../../../constants');
const { getSumVars } = require('../../../schema_func');

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
  compressResponse,
  rpc,
  topargs,
  mInput,
}) {
  const responseA = getErrorResponse({ error, mInput, response });

  const responseB = addMetadata({ response: responseA, metadata, mInput });

  validateResponse({ response: responseB });

  // Response before transformation
  const { type, content: responseC } = responseB;

  const content = transformContent({ response: responseB, mInput, rpcHandler });

  await send({
    protocolHandler,
    specific,
    content,
    response: responseC,
    type,
    format,
    compressResponse,
    rpc,
    topargs,
    error,
  });

  const newInput = getNewInput({ type, content: responseC });
  return newInput;
};

// Use protocol-specific way to send back the response to the client
const getErrorResponse = function ({ error, mInput, response }) {
  if (!error) { return response; }

  const content = getStandardError({ error, mInput });

  // Do not show stack trace in error responses
  const contentA = omit(content, 'details');

  return { type: 'error', content: contentA };
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

const getNewInput = function ({ type, content }) {
  const responsedata = MODEL_TYPES.includes(type)
    ? content.data
    : content;
  // `responsedatasize` and `responsedatacount` schema variables
  const sumVars = getSumVars({ attrName: 'responsedata', value: responsedata });

  return { response: content, responsetype: type, responsedata, ...sumVars };
};

module.exports = {
  sendResponse,
};
