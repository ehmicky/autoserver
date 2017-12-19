'use strict';

const { normalizeCharset } = require('../../../charsets');

// Retrieve charset asked by client for the request and response payload
const getCharset = function ({ queryvars, charset, format }) {
  // E.g. ?charset query variable or charset in Content-Type HTTP header
  const charsetA = queryvars.charset || charset;
  const charsetB = normalizeCharset({ charset: charsetA, format });
  return charsetB;
};

module.exports = {
  getCharset,
};
