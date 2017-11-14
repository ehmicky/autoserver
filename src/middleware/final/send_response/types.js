'use strict';

const { formatHandlers } = require('../../../formats');

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

module.exports = {
  types,
  getMime,
};
