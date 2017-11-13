'use strict';

const { encodingExists, decode: decodeCharset } = require('iconv-lite');

const { throwError, addGenErrorHandler } = require('../../../error');

// Decode encoding/charset
const parseCharset = function ({ payload, specific, protocolHandler, format }) {
  const charset = getCharset({ specific, protocolHandler, format });

  const payloadA = eDecodeCharset(payload, charset);

  return payloadA;
};

// Use protocol-specific way to retrieve the payload charset
const getCharset = function ({
  specific,
  protocolHandler,
  format,
  format: { charsets = [] },
}) {
  const charset = protocolHandler.getCharset({ specific });

  if (charset === undefined) {
    return charsets[0] || DEFAULT_CHARSET;
  }

  validateCharset({ charset, format });

  const charsetA = charset.toLowerCase();
  return charsetA;
};

const DEFAULT_CHARSET = 'binary';

const validateCharset = function ({ charset, format: { charsets, title } }) {
  if (!encodingExists(charset)) {
    const message = `Invalid charset: ${charset}`;
    throwError(message, { reason: 'WRONG_CONTENT_TYPE' });
  }

  const typeSupportsCharset = charsets === undefined ||
    charsets.includes(charset);

  if (!typeSupportsCharset) {
    const message = `Invalid charset: ${charset} cannot be used with a ${title} content type`;
    throwError(message, { reason: 'WRONG_CONTENT_TYPE' });
  }
};

// Charset decoding is done in a protocol-agnostic way
const eDecodeCharset = addGenErrorHandler(decodeCharset, {
  message: ({ charset }) => `The request payload is invalid: the charset '${charset}' could not be decoded`,
  reason: 'WRONG_CONTENT_TYPE',
});

module.exports = {
  parseCharset,
};
