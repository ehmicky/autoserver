'use strict';

const { decode } = require('iconv-lite');

const { addGenPbHandler } = require('../errors');

// Charset decoding
const decodeCharset = function (charset, content) {
  return decode(content, charset);
};

const eDecodeCharset = addGenPbHandler(decodeCharset, {
  reason: 'CHARSET',
  extra: charset => ({ adapter: charset }),
});

module.exports = {
  decodeCharset: eDecodeCharset,
};
