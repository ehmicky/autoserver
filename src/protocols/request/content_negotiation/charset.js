'use strict';

const { addGenErrorHandler } = require('../../../errors');
const { getCharset } = require('../../../charsets');

// Retrieve charset asked by client for the request and response payload
const getCharsetFunc = function ({ queryvars, charset, format }) {
  // E.g. ?charset query variable or charset in Content-Type HTTP header
  const charsetA = queryvars.charset || charset;
  const charsetB = eGetCharset(charsetA, { format });
  return charsetB;
};

const eGetCharset = addGenErrorHandler(getCharset, {
  reason: 'RESPONSE_NEGOTIATION',
});

module.exports = {
  getCharset: getCharsetFunc,
};
