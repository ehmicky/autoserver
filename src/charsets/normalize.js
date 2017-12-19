'use strict';

const { DEFAULT_INPUT_CHARSET } = require('./constants');
const { validateCharset } = require('./validate');

// Normalize charset, including adding defaults and validating
const normalizeCharset = function ({ charset, format }) {
  const charsetA = addDefaultCharset({ charset, format });

  const charsetB = charsetA.toLowerCase();

  validateCharset({ charset: charsetB, format });

  return charsetB;
};

const addDefaultCharset = function ({ charset, format: { charsets = [] } }) {
  return charset ||
    // Charset specified by this format
    charsets[0] ||
    DEFAULT_INPUT_CHARSET;
};

module.exports = {
  normalizeCharset,
};
