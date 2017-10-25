'use strict';

// Each content type is sent differently
const types = {

  model: {
    handler (opts) {
      const contentType = 'application/x-resource+json';
      return sendJson({ ...opts, contentType });
    },
    emptyResponse: {},
  },

  collection: {
    handler (opts) {
      const contentType = 'application/x-collection+json';
      return sendJson({ ...opts, contentType });
    },
    emptyResponse: {},
  },

  error: {
    handler (opts) {
      // See RFC 7807
      // Exception: `protocolStatus` is only present with HTTP protocol
      const contentType = 'application/problem+json';
      return sendJson({ ...opts, contentType });
    },
    emptyResponse: {},
  },

  object: {
    handler (opts) {
      return sendJson(opts);
    },
    emptyResponse: {},
  },

  html: {
    handler (opts) {
      return sendHtml(opts);
    },
    emptyResponse: '',
  },

  text: {
    handler (opts) {
      return sendText(opts);
    },
    emptyResponse: '',
  },

};

const sendJson = function ({ content,
  contentType = 'application/json',
  ...opts
}) {
  const contentA = JSON.stringify(content, null, 2);
  return send({ content: contentA, contentType, ...opts });
};

const sendHtml = function ({ content, contentType = 'text/html', ...opts }) {
  return send({ content, contentType, ...opts });
};

const sendText = function ({ content, contentType = 'text/plain', ...opts }) {
  return send({ content, contentType, ...opts });
};

const send = function ({
  protocolHandler,
  specific,
  content,
  contentType,
  protocolStatus,
}) {
  const contentLength = Buffer.byteLength(content);

  return protocolHandler.send({
    specific,
    content,
    contentType,
    contentLength,
    protocolStatus,
  });
};

module.exports = {
  types,
};
