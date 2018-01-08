'use strict';

const { getCharset } = require('../formats');

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
const addDefaultCharset = function ({ charset, format }) {
  const formatCharset = getCharset({ format });

  return charset || formatCharset || DEFAULT_INPUT_CHARSET;
};

module.exports = {
  normalizeCharset,
};
