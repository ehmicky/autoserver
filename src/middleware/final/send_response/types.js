'use strict';

const { DEFAULT_OUTPUT_CHARSET } = require('../../../charsets');
const { serializeContentType } = require('../../../formats');

// Each content type is sent differently
const TYPES = {
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

// Retrieve response content type
const getContentType = function ({ format, type }) {
  const { mime } = TYPES[type];
  const charset = DEFAULT_OUTPUT_CHARSET;
  const contentType = serializeContentType({ mime, charset, format });
  return contentType;
};

module.exports = {
  getContentType,
  TYPES,
};
