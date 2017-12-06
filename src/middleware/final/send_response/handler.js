'use strict';

const { getErrorResponse } = require('./error');
const { getResponseVars } = require('./vars');
const { addMetadata } = require('./metadata');
const { validateResponse } = require('./validate');
const { transformContent } = require('./transform');
const { send } = require('./send');

// Sends the response at the end of the request
const sendResponse = async function ({
  error,
  response,
  metadata,
  specific,
  protocolAdapter,
  rpcAdapter,
  format,
  compressResponse,
  rpc,
  topargs,
  mInput,
}) {
  const responseA = getErrorResponse({ error, mInput, response });

  const responseVars = getResponseVars(responseA);
  // `responseVars` is not yet added to `mInput` so we do it now
  const mInputA = { ...mInput, ...responseVars };

  const responseB = addMetadata({
    response: responseA,
    metadata,
    mInput: mInputA,
  });

  validateResponse({ response: responseB });

  // Response before transformation
  const { type, content: responseC } = responseB;

  const content = transformContent({
    response: responseB,
    mInput: mInputA,
    rpcAdapter,
  });

  await send({
    protocolAdapter,
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

  return responseVars;
};

module.exports = {
  sendResponse,
};
