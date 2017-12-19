'use strict';

const { decode } = require('iconv-lite');

// Charset decoding
const decodeCharset = function ({ content, charset }) {
  return decode(content, charset);
};

module.exports = {
  decodeCharset,
};
