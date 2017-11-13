'use strict';

const { throwError } = require('../../../error');
const { findFormatByMime } = require('../../../formats');

// Find the payload format
const getFormat = function ({ specific, protocolHandler }) {
  const mime = getMime({ specific, protocolHandler });

  // Check the content-type header against hard-coded MIME types
  const format = findFormatByMime({ mime });

  // Means this is not a structured type, like media types,
  // and unlike JSON or YAML
  // This won't be parsed (i.e. returned as is), and will use 'binary' charset
  if (format === undefined) {
    return { name: mime, title: mime };
  }

  return format;
};

// Use protocol-specific way to retrieve the MIME type
const getMime = function ({ specific, protocolHandler }) {
  const mime = protocolHandler.getMime({ specific });
  if (mime) { return mime; }

  const message = 'Must specify format when sending a request payload';
  throwError(message, { reason: 'WRONG_CONTENT_TYPE' });
};

module.exports = {
  getFormat,
};
