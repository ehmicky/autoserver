'use strict';


const { httpBody } = require('../../parsing');
const { ProtocolError } = require('../../error');
const { isDev } = require('../../../utilities');


const httpSendResponse = async function (input) {
  const { res } = input;
  let response;
  try {
    response = await this.next(input);
  } catch (error) {
    if (! (error instanceof ProtocolError)) { throw error; }
    httpSendError({ error, input });
    return;
  }
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

const httpSendError = function ({ error, input: { res } }) {
  switch (error.reason) {
    case ProtocolError.reason.NOT_FOUND:
      res.statusCode = 404;
      if (isDev()) {
        httpBody.send.json({ res, message: error });
      } else {
        httpBody.send.noBody({ res });
      }
      break;
    default:
      throw error;
  }
};


module.exports = {
  httpSendResponse,
};