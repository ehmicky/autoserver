'use strict';


const { httpSendResponse } = require('./http');


// Sends the response at the end of the request
const sendResponse = async function () {
  return async function sendResponse(input) {
    const send = sendResponseMap[input.protocol.name].bind(null, input);
    try {
      const response = await this.next(input);
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
