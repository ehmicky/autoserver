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

// Add default charsets, including the format's default charset
const addDefaultCharset = function ({ charset, format: { charsets = [] } }) {
  return charset || charsets[0] || DEFAULT_INPUT_CHARSET;
};

module.exports = {
  normalizeCharset,
};
