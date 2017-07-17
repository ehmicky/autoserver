'use strict';

const { sender } = require('./sender');

// Sends the response at the end of the request
const sendResponse = async function (input) {
  const { log } = input;
  const send = sender.bind(null, input);

  try {
    const response = await this.next(input);
    const { content, type } = response;

    const perf = log.perf.start('protocol.sendResponse', 'middleware');

    log.add({ response: { content, type } });

    await send(response);

    perf.stop();
    return response;
  } catch (error) {
    const perf = log.perf.start('protocol.sendResponse', 'exception');

    const errorObj = error instanceof Error ? error : new Error(String(error));

    // Handler to send response error
    // Since we only send response errors if `errorObj.sendError` is defined,
    // and it can only be defined if this middleware throws, we are sure
    // to never send two responses.
    errorObj.sendError = send;

    perf.stop();
    throw errorObj;
  }
};

module.exports = {
  sendResponse,
};
