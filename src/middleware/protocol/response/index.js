'use strict';


const { httpSendResponse } = require('./http');


// Sends the response at the end of the request
const sendResponse = async function () {
  return async function sendResponse(input) {
    const send = sender.bind(null, input);

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

const sender = function (input, response) {
  sendResponseMap[input.protocol](input, response);
  addLogInfo({ input, response });
};

const sendResponseMap = {
  http: httpSendResponse,
};

const addLogInfo = function ({
  input: { logInfo },
  response: { content, type },
}) {
  logInfo.add({ response: { content, type } });
};


module.exports = {
  sendResponse,
};
