'use strict';

// Set basic payload headers, then delegate to protocol handler
const send = function ({
  protocolHandler,
  specific,
  content,
  type,
  topargs,
  error,
  protocolstatus,
}) {
  const contentA = stringifyContent({ content, topargs, error });

  const contentLength = Buffer.byteLength(contentA);
  const { contentType } = types[type];

  return protocolHandler.send({
    specific,
    content: contentA,
    contentType,
    contentLength,
    protocolstatus,
  });
};

// Set a type-specific empty response when `args.silent` is used
// (unless this is an error response).
const stringifyContent = function ({
  content,
  topargs: { silent } = {},
  error,
}) {
  if (silent && error === undefined) { return ''; }

  if (typeof content === 'string') { return content; }

  const contentA = JSON.stringify(content, null, 2);
  return contentA;
};

// Each content type is sent differently
const types = {
  model: {
    contentType: 'application/x-resource+json',
  },

  models: {
    contentType: 'application/x-collection+json',
  },

  error: {
    // See RFC 7807
    contentType: 'application/problem+json',
  },

  object: {
    contentType: 'application/json',
  },

  html: {
    contentType: 'text/html',
  },

  text: {
    contentType: 'text/plain',
  },
};

module.exports = {
  send,
  types,
};
