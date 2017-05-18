'use strict';


const { httpBody } = require('../../../parsing');
const { EngineError } = require('../../../error');


// Sends the HTTP response at the end of the request
const httpSendResponse = function () {
  return async function httpSendResponse(input) {
    const { protocol: { specific: { res } } } = input;

    const response = await this.next(input);
    const { type, content } = response;

    if (!content || !type) {
      throw new EngineError('Server sent an empty response', {
        reason: 'WRONG_RESPONSE',
      });
    }

    // Use different logic according to the content type
    const handler = handlers[type];
    if (!handler) {
      const message = 'Server tried to respond with an unsupported content type';
      throw new EngineError(message, { reason: 'WRONG_RESPONSE' });
    }
    handler({ res, message: content });

    return response;
  };
};

// Each content type is sent differently
const handlers = {

  model({ res, message }) {
    httpBody.send.json({
      res,
      message,
      contentType: 'application/x-resource+json',
    });
  },

  collection({ res, message }) {
    httpBody.send.json({
      res,
      message,
      contentType: 'application/x-collection+json',
    });
  },

  object({ res, message }) {
    httpBody.send.json({ res, message });
  },

  html({ res, message }) {
    httpBody.send.html({ res, message });
  },

  text({ res, message }) {
    httpBody.send.text({ res, message });
  },

};


module.exports = {
  httpSendResponse,
};
