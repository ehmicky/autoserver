'use strict';

const { pick } = require('../../../utilities');
const { normalizeError, rethrowError } = require('../../../error');
const { addReqInfo } = require('../../../events');

const { sender } = require('./sender');

// Sends the response at the end of the request
const sendResponse = async function (nextFunc, input) {
  try {
    const inputA = await nextFunc(input);

    const responseInfo = pick(inputA.response, ['content', 'type']);
    addReqInfo(inputA, { response: responseInfo });

    await sender(inputA, inputA.response);

    return inputA;
  } catch (error) {
    const errorA = normalizeError({ error });

    // Handler to send response error
    // Since we only send response errors if `errorObj.sendError` is defined,
    // and it can only be defined if this middleware throws, we are sure
    // to never send two responses.
    const sendError = sender.bind(null, input);
    const errorB = { ...errorA, sendError };

    rethrowError(errorB);
  }
};

module.exports = {
  sendResponse,
};
