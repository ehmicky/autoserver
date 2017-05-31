'use strict';


const { sender } = require('./sender');


// Sends the response at the end of the request
const sendResponse = async function () {
  return async function sendResponse(input) {
    const send = sender.bind(null, input);

    try {
      const { log } = input;
      const response = await this.next(input);
      const { content, type } = response;

      log.add({ response: { content, type } });

      send(response);

      return response;
    } catch (error) {
      if (!(error instanceof Error)) {
        error = new Error(String(error));
      }

      // Handler to send response error
      error.sendError = send;
      throw error;
    }
  };
};


module.exports = {
  sendResponse,
};
