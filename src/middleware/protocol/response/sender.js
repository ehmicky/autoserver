'use strict';


const parsing = require('../../../parsing');
const { EngineError } = require('../../../error');


// Sends the HTTP response at the end of the request
const sender = function (
  { specific, protocolStatus: status = 500, protocol },
  { type, content }
) {
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

  const sendBody = parsing[protocol].body.send;
  handler({ sendBody, specific, content, status });
};

// Each content type is sent differently
// TODO: validate content typeof?
const handlers = {

  model({ sendBody, specific, content, status }) {
    const contentType = 'application/x-resource+json';
    sendBody.json({ specific, content, contentType, status });
  },

  collection({ sendBody, specific, content, status }) {
    const contentType = 'application/x-collection+json';
    sendBody.json({ specific, content, contentType, status });
  },

  error({ sendBody, specific, content, status }) {
    // See RFC 7807
    // Exception: `status` is only present with HTTP protocol
    const contentType = 'application/problem+json';
    sendBody.json({ specific, content, contentType, status });
  },

  object({ sendBody, specific, content, status }) {
    sendBody.json({ specific, content, status });
  },

  html({ sendBody, specific, content, status }) {
    sendBody.html({ specific, content, status });
  },

  text({ sendBody, specific, content, status }) {
    sendBody.text({ specific, content, status });
  },

};


module.exports = {
  sender,
};
