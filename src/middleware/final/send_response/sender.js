'use strict';

const { throwError } = require('../../../error');

// Sends the response at the end of the request
const sender = function ({
  specific,
  protocolHandler,
  protocolStatus,
  response: { type, content },
}) {
  if (!type) {
    throwError('Server sent an response with no content type', {
      reason: 'SERVER_INPUT_VALIDATION',
    });
  }

  if (content === undefined) {
    throwError('Server sent an empty response', {
      reason: 'SERVER_INPUT_VALIDATION',
    });
  }

  // Use different logic according to the content type
  const handler = handlers[type];

  if (!handler) {
    const message = 'Server tried to respond with an unsupported content type';
    throwError(message, { reason: 'SERVER_INPUT_VALIDATION' });
  }

  handler({ protocolHandler, specific, content, protocolStatus });
};

// Each content type is sent differently
// TODO: validate content typeof?
const handlers = {

  model ({ protocolHandler: { send }, specific, content, protocolStatus }) {
    const contentType = 'application/x-resource+json';
    send.json({ specific, content, contentType, protocolStatus });
  },

  collection ({
    protocolHandler: { send },
    specific,
    content,
    protocolStatus,
  }) {
    const contentType = 'application/x-collection+json';
    send.json({ specific, content, contentType, protocolStatus });
  },

  error ({ protocolHandler: { send }, specific, content, protocolStatus }) {
    // See RFC 7807
    // Exception: `protocolStatus` is only present with HTTP protocol
    const contentType = 'application/problem+json';
    send.json({ specific, content, contentType, protocolStatus });
  },

  object ({ protocolHandler: { send }, specific, content, protocolStatus }) {
    send.json({ specific, content, protocolStatus });
  },

  html ({ protocolHandler: { send }, specific, content, protocolStatus }) {
    send.html({ specific, content, protocolStatus });
  },

  text ({ protocolHandler: { send }, specific, content, protocolStatus }) {
    send.text({ specific, content, protocolStatus });
  },

};

module.exports = {
  sender,
};
