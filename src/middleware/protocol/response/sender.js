'use strict';

const { EngineError } = require('../../../error');

// Sends the response at the end of the request
const sender = async function (
  {
    specific,
    protocolHandler,
    protocolStatus: status = protocolHandler.failureProtocolStatus,
  },
  { type, content }
) {
  if (!type) {
    throw new EngineError('Server sent an response with no content type', {
      reason: 'SERVER_INPUT_VALIDATION',
    });
  }
  if (content === undefined && type !== 'failure') {
    throw new EngineError('Server sent an empty response', {
      reason: 'SERVER_INPUT_VALIDATION',
    });
  }

  // Use different logic according to the content type
  const handler = handlers[type];
  if (!handler) {
    const message = 'Server tried to respond with an unsupported content type';
    throw new EngineError(message, { reason: 'SERVER_INPUT_VALIDATION' });
  }

  await handler({ protocolHandler, specific, content, status });
};

// Each content type is sent differently
// TODO: validate content typeof?
const handlers = {

  async model({ protocolHandler: { send }, specific, content, status }) {
    const contentType = 'application/x-resource+json';
    await send.json({ specific, content, contentType, status });
  },

  async collection({ protocolHandler: { send }, specific, content, status }) {
    const contentType = 'application/x-collection+json';
    await send.json({ specific, content, contentType, status });
  },

  async error({ protocolHandler: { send }, specific, content, status }) {
    // See RFC 7807
    // Exception: `status` is only present with HTTP protocol
    const contentType = 'application/problem+json';
    await send.json({ specific, content, contentType, status });
  },

  async object({ protocolHandler: { send }, specific, content, status }) {
    await send.json({ specific, content, status });
  },

  async html({ protocolHandler: { send }, specific, content, status }) {
    await send.html({ specific, content, status });
  },

  async text({ protocolHandler: { send }, specific, content, status }) {
    await send.text({ specific, content, status });
  },

  async failure({
    protocolHandler: { send, failureProtocolStatus: status },
    specific,
  }) {
    await send.nothing({ specific, status });
  },

};

module.exports = {
  sender,
};
