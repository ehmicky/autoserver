'use strict';

const { pick } = require('../../../utilities');
const { normalizeError, rethrowError } = require('../../../error');
const { addLogInfo } = require('../../../logging');

const { sender } = require('./sender');

// Sends the response at the end of the request
const sendResponse = async function (nextFunc, input) {
  const send = sender.bind(null, input);

  try {
    const response = await nextFunc(input);

    const responseInfo = pick(response, ['content', 'type']);
    const responseA = addLogInfo(response, { response: responseInfo });

    await send(responseA);

    return responseA;
  } catch (error) {
    const errorA = normalizeError({ error });

    // Handler to send response error
    // Since we only send response errors if `errorObj.sendError` is defined,
    // and it can only be defined if this middleware throws, we are sure
    // to never send two responses.
    const errorB = Object.assign({}, errorA, { sendError: send });

    rethrowError(errorB);
  }
};

module.exports = {
  sendResponse,
};
