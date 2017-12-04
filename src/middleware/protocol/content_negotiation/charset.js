'use strict';

const { encodingExists } = require('iconv-lite');

const { throwError } = require('../../../error');
const { DEFAULT_INPUT_CHARSET } = require('../../../charsets');

// Retrieve charset asked by client for the request and response payload
const getCharset = function ({ queryvars, charset, format }) {
  const charsetA = getCharsetName({ queryvars, charset, format });

  const charsetB = charsetA.toLowerCase();

  validateCharset({ charset: charsetB, format });

  return charsetB;
};

const getCharsetName = function ({
  queryvars,
  charset,
  format: { charsets = [] },
}) {
  // ?charset query variable
  return queryvars.charset ||
    // E.g. charset in Content-Type HTTP header
    charset ||
    // Charset specified by this format
    charsets[0] ||
    DEFAULT_INPUT_CHARSET;
};

const validateCharset = function ({ charset, format: { charsets, title } }) {
  if (!encodingExists(charset)) {
    const message = `Unsupported charset: '${charset}'`;
    throwError(message, { reason: 'RESPONSE_FORMAT' });
  }

  const typeSupportsCharset = charsets === undefined ||
    charsets.includes(charset);

  if (!typeSupportsCharset) {
    const message = `Unsupported charset with a ${title} content type: '${charset}'`;
    throwError(message, { reason: 'RESPONSE_FORMAT' });
  }
};

module.exports = {
  getCharset,
};
