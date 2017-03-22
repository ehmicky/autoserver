'use strict';


const { httpBody } = require('../../../parsing');


const httpSendResponse = () => async function (input) {
  const { res } = input;
  const response = await this.next(input);
  const { type, content } = response;

  if (content && type) {
    if (type === 'object') {
      httpBody.send.json({ res, message: content });
    } else if (type === 'html') {
      httpBody.send.html({ res, message: content });
    }
  }

  return response;
};


module.exports = {
  httpSendResponse,
};