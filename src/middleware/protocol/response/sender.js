'use strict';


const { EngineError } = require('../../../error');


// Sends the response at the end of the request
const sender = async function (
  { specific, protocolStatus: status = 500, protocolHandler },
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

  const send = protocolHandler.send;
  await handler({ send, specific, content, status });
};

// Each content type is sent differently
// TODO: validate content typeof?
const handlers = {

  async model({ send, specific, content, status }) {
    const contentType = 'application/x-resource+json';
    await send.json({ specific, content, contentType, status });
  },

  async collection({ send, specific, content, status }) {
    const contentType = 'application/x-collection+json';
    await send.json({ specific, content, contentType, status });
  },

  async error({ send, specific, content, status }) {
    // See RFC 7807
    // Exception: `status` is only present with HTTP protocol
    const contentType = 'application/problem+json';
    await send.json({ specific, content, contentType, status });
  },

  async object({ send, specific, content, status }) {
    await send.json({ specific, content, status });
  },

  async html({ send, specific, content, status }) {
    await send.html({ specific, content, status });
  },

  async text({ send, specific, content, status }) {
    await send.text({ specific, content, status });
  },

};


module.exports = {
  sender,
};
