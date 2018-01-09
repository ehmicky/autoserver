'use strict';

const { decode } = require('iconv-lite');

const { addGenErrorHandler } = require('../errors');

// Charset decoding
const decodeCharset = function (charset, content) {
  return decode(content, charset);
};

const eDecodeCharset = addGenErrorHandler(decodeCharset, {
  message: charset => `Invalid charset: '${charset}' could not be decoded`,
  reason: 'CHARSET',
});

module.exports = {
  decodeCharset: eDecodeCharset,
};
