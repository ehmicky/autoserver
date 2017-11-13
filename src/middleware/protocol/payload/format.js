'use strict';

const { throwError } = require('../../../error');
const { findFormat } = require('../../../formats');

// Find the payload format
const getFormat = function ({ specific, protocolHandler }) {
  const mime = getMime({ specific, protocolHandler });

  // Check the content-type header against hard-coded MIME types
  const format = findFormat({ type: 'payload', mime });
  return format;
};

// Use protocol-specific way to retrieve the MIME type
const getMime = function ({ specific, protocolHandler }) {
  const mime = protocolHandler.getMime({ specific });
  if (mime) { return mime; }

  const message = 'Must specify format when sending a request payload';
  throwError(message, { reason: 'SYNTAX_VALIDATION' });
};

module.exports = {
  getFormat,
};
