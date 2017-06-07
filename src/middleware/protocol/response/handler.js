'use strict';


const { sender } = require('./sender');


// Sends the response at the end of the request
const sendResponse = async function () {
  return async function sendResponse(input) {
    const { log } = input;
    const send = sender.bind(null, input);

    try {
      const response = await this.next(input);
      const { content, type } = response;

      const perf = log.perf.start('sendResponse', 'middleware');

      log.add({ response: { content, type } });

      await send(response);

      perf.stop();
      return response;
    } catch (error) {
      const perf = log.perf.start('sendResponse', 'exception');

      if (!(error instanceof Error)) {
        error = new Error(String(error));
      }

      // Handler to send response error
      error.sendError = send;

      perf.stop();
      throw error;
    }
  };
};


module.exports = {
  sendResponse,
};
