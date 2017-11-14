'use strict';

const { encodingExists } = require('iconv-lite');

const { omit } = require('../../utilities');
const { throwError } = require('../../error');
const { formatHandlers, defaultCharset } = require('../../formats');

// Retrieve format and charset of both the request and response payloads
const parseFormatCharset = function ({ topargs, queryvars }) {
  const format = getFormat({ topargs, queryvars });
  const charset = getCharset({ topargs, queryvars, format });
  const topargsA = omit(topargs, ['format', 'charset']);
  console.log(format.name, charset);
  return { topargs: topargsA, format, charset };
};

const getFormat = function ({ topargs, queryvars }) {
  // E.g. MIME in Content-Type HTTP header
  const formatName = topargs.format ||
    // ?format query variable
    queryvars.format;

  const format = formatHandlers[formatName];
  if (format !== undefined) { return format; }

  // Means this is not a structured type, like media types,
  // and unlike JSON or YAML
  // This won't be parsed (i.e. returned as is), and will use 'binary' charset
  return {};
};

const getCharset = function ({
  topargs,
  queryvars,
  format,
  format: { charsets = [] },
}) {
  // E.g. charset in Content-Type HTTP header
  const charset = topargs.charset ||
    // ?charset query variable
    queryvars.charset ||
    // Charset specified by this format
    charsets[0] ||
    // Generic default
    defaultCharset;

  validateCharset({ charset, format });

  const charsetA = charset.toLowerCase();
  return charsetA;
};

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
  parseFormatCharset,
};
