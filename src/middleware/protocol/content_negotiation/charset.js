'use strict';

const { addGenErrorHandler } = require('../../../errors');
const { normalizeCharset } = require('../../../charsets');

// Retrieve charset asked by client for the request and response payload
const getCharset = function ({ queryvars, charset, format }) {
  // E.g. ?charset query variable or charset in Content-Type HTTP header
  const charsetA = queryvars.charset || charset;
  const charsetB = eNormalizeCharset({ charset: charsetA, format });
  return charsetB;
};

const eNormalizeCharset = addGenErrorHandler(normalizeCharset, {
  message: ({ charset }, { message }) =>
    message || `Unsupported charset: '${charset}'`,
  reason: 'RESPONSE_FORMAT',
});

module.exports = {
  getCharset,
};
