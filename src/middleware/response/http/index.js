'use strict';


const { httpBody } = require('../../../parsing');
const { EngineError } = require('../../../error');


const httpSendResponse = async function () {
  return async function (input) {
    const { res } = input;
    const response = await this.next(input);
    const { type, content } = response;

    if (content && type) {
      if (type === 'object') {
        httpBody.send.json({ res, message: content });
      } else if (type === 'html') {
        httpBody.send.html({ res, message: content });
      } else if (type === 'text') {
        httpBody.send.text({ res, message: content });
      } else {
        throw new EngineError('Server tried to respond with an unsupported content type', { reason: 'WRONG_RESPONSE' });
      }
    } else {
      throw new EngineError('Server sent an empty response', { reason: 'WRONG_RESPONSE' });
    }

    return response;
  };
};


module.exports = {
  httpSendResponse,
};