'use strict';


const { httpSendResponse } = require('./http');


// Sends the response at the end of the request
const sendResponse = async function () {
  return async function sendResponse(input) {
    const { logInfo } = input;
    const send = sendResponseMap[input.protocol].bind(null, input);

    try {
      const response = await this.next(input);
      const { content, type } = response;

      logInfo.add({ response: { content, type } });

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

const sendResponseMap = {
  http: httpSendResponse,
};


module.exports = {
  sendResponse,
};
