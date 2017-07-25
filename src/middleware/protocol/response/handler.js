'use strict';

const { pick } = require('../../../utilities');
const { normalizeError, throwError } = require('../../../error');

const { sender } = require('./sender');

// Sends the response at the end of the request
const sendResponse = async function (nextFunc, input) {
  const { log } = input;
  const send = sender.bind(null, input);

  try {
    const response = await nextFunc(input);

    log.add({ response: pick(response, ['content', 'type']) });

    await send(response);

    return response;
  } catch (error) {
    const errorObj = normalizeError({ error });

    // Handler to send response error
    // Since we only send response errors if `errorObj.sendError` is defined,
    // and it can only be defined if this middleware throws, we are sure
    // to never send two responses.
    errorObj.sendError = send;

    throwError(errorObj);
  }
};

module.exports = {
  sendResponse,
};
