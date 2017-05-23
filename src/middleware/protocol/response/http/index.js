'use strict';


const { httpBody } = require('../../../../parsing');
const { EngineError } = require('../../../../error');


// Sends the HTTP response at the end of the request
const httpSendResponse = function (input, response) {
  const { specific: { res, status } } = input;
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

  handler({ res, content, status });
};

// Each content type is sent differently
// TODO: validate content typeof?
const handlers = {

  model({ res, content, status }) {
    httpBody.send.json({
      res,
      content,
      contentType: 'application/x-resource+json',
      status,
    });
  },

  collection({ res, content, status }) {
    httpBody.send.json({
      res,
      content,
      contentType: 'application/x-collection+json',
      status,
    });
  },

  error({ res, content, status }) {
    httpBody.send.json({
      res,
      content,
      // See RFC 7807
      // Exception: `status` is only present with HTTP protocol
      contentType: 'application/problem+json',
      status,
    });
  },

  object({ res, content, status }) {
    httpBody.send.json({ res, content, status });
  },

  html({ res, content, status }) {
    httpBody.send.html({ res, content, status });
  },

  text({ res, content, status }) {
    httpBody.send.text({ res, content, status });
  },

};


module.exports = {
  httpSendResponse,
};
