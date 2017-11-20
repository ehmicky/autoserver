'use strict';

const { format: formatMime } = require('content-type');

const { DEFAULT_OUTPUT_CHARSET } = require('../../../charsets');

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

// Retrieve response MIME type
const getMime = function ({ format, type }) {
  const { mime } = types[type];

  const contentType = getContentType({ format, mime });
  const mimeA = formatMime({
    type: contentType,
    parameters: { charset: DEFAULT_OUTPUT_CHARSET },
  });
  return mimeA;
};

const getContentType = function ({
  format: { mimes = [], mimeExtensions = [] },
  mime,
}) {
  if (mime === undefined) {
    return mimes[0];
  }

  if (mime.endsWith('+')) {
    return addMimeExtension({ mime, mimes, mimeExtensions });
  }

  return mime;
};

const addMimeExtension = function ({ mime, mimes, mimeExtensions }) {
  const [mimeExtension] = mimeExtensions;

  if (mimeExtension === undefined) {
    return mimes[0];
  }

  return `${mime}${mimeExtension.slice(1)}`;
};

module.exports = {
  types,
  getMime,
};
