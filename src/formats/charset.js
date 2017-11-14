'use strict';

const { encodingExists } = require('iconv-lite');

const { throwError } = require('../error');

// Use protocol-specific way to retrieve the charset.
// Also validates and normalize it.
const getCharset = function ({ charset, format, format: { charsets = [] } }) {
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
    throwError(message, { reason: 'INPUT_VALIDATION' });
  }

  const typeSupportsCharset = charsets === undefined ||
    charsets.includes(charset);

  if (!typeSupportsCharset) {
    const message = `Invalid charset: ${charset} cannot be used with a ${title} content type`;
    throwError(message, { reason: 'INPUT_VALIDATION' });
  }
};

module.exports = {
  getCharset,
};
