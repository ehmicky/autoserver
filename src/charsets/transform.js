'use strict';

const { decode } = require('iconv-lite');

const { addGenErrorHandler } = require('../errors');

// Charset decoding
const decodeCharset = function (charset, content) {
  return decode(content, charset);
};

const eDecodeCharset = addGenErrorHandler(decodeCharset, { reason: 'CHARSET' });

module.exports = {
  decodeCharset: eDecodeCharset,
};
