'use strict';

const { getFormatCharset } = require('../formats');

const { DEFAULT_INPUT_CHARSET } = require('./constants');
const { validateCharset } = require('./validate');
const { decodeCharset } = require('./transform');

// Normalize charset, including adding defaults and validating
const getCharset = function (charset, { format } = {}) {
  const charsetA = addDefaultCharset({ charset, format });

  const charsetB = charsetA.toLowerCase();

  validateCharset({ charset: charsetB, format });

  const charsetC = createInstance({ charset: charsetB, title: charsetA });

  return charsetC;
};

// Add default charsets, including the format's default charset
const addDefaultCharset = function ({ charset, format }) {
  const formatCharset = getFormatCharset({ format });

  return charset || formatCharset || DEFAULT_INPUT_CHARSET;
};

// Returns a charset adapter object
const createInstance = function ({ charset, title }) {
  const decode = decodeCharset.bind(null, charset);

  return { name: charset, title, decode };
};

module.exports = {
  getCharset,
};
