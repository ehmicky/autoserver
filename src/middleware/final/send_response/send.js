'use strict';

const { formatHandlers, serialize } = require('../../../formats');

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
  const format = 'json';

  const mime = getMime({ format, type });

  const contentA = stringifyContent({ format, content, topargs, error });

  return protocolHandler.send({
    specific,
    content: contentA,
    mime,
    protocolstatus,
  });
};

// Retrieve response MIME type
const getMime = function ({ format = 'json', type }) {
  const { mime } = types[type];
  const { mimes } = formatHandlers[format] || {};

  if (mime === undefined) {
    return mimes[0];
  }

  if (mime.endsWith('+')) {
    return addSuffix({ mime, mimes });
  }

  return mime;
};

const addSuffix = function ({ mime, mimes }) {
  const suffix = mimes.find(mimeA => mimeA.startsWith('+'));

  if (suffix === undefined) {
    return mimes[0];
  }

  return `${mime}${suffix.slice(1)}`;
};

const stringifyContent = function ({
  format,
  content,
  topargs: { silent } = {},
  error,
}) {
  // When `args.silent` is used (unless this is an error response).
  if (silent && error === undefined) { return ''; }

  if (typeof content === 'string') { return content; }

  const contentA = serialize({ format, content });
  return contentA;
};

// Each content type is sent differently
const types = {
  model: {
    mime: 'application/x-resource+',
  },

  models: {
    mime: 'application/x-collection+',
  },

  error: {
    // See RFC 7807
    mime: 'application/problem+',
  },

  object: {},

  html: {
    mime: 'text/html',
  },

  text: {
    mime: 'text/plain',
  },
};

module.exports = {
  send,
  types,
};
