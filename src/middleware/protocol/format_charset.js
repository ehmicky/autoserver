'use strict';

const { encodingExists } = require('iconv-lite');

const { omit } = require('../../utilities');
const { throwError } = require('../../error');
const { formatHandlers, defaultFormat } = require('../../formats');

// Retrieve format and charset of both the request and response payloads
const parseFormatCharset = function ({ topargs, queryvars }) {
  const format = getFormat({ topargs, queryvars });
  const charset = getCharset({ topargs, queryvars, format });
  const topargsA = omit(topargs, ['format', 'charset']);
  const queryvarsA = omit(queryvars, ['format', 'charset']);
  return { topargs: topargsA, queryvars: queryvarsA, format, charset };
};

const getFormat = function ({ topargs, queryvars }) {
  // E.g. MIME in Content-Type HTTP header
  const formatName = topargs.format ||
    // ?format query variable
    queryvars.format;
  if (formatName === undefined) { return; }

  const format = formatHandlers[formatName];
  if (format !== undefined) { return format; }

  const message = `Unsupported response format: '${formatName}'`;
  throwError(message, { reason: 'RESPONSE_FORMAT' });
};

const getCharset = function ({
  topargs,
  queryvars,
  format = defaultFormat,
  format: { charsets = [] } = defaultFormat,
}) {
  // E.g. charset in Content-Type HTTP header
  const charset = topargs.charset ||
    // ?charset query variable
    queryvars.charset ||
    // Charset specified by this format
    charsets[0];
  if (charset === undefined) { return; }

  validateCharset({ charset, format });

  const charsetA = charset.toLowerCase();
  return charsetA;
};

const validateCharset = function ({ charset, format: { charsets, title } }) {
  if (!encodingExists(charset)) {
    const message = `Unsupported response charset: '${charset}'`;
    throwError(message, { reason: 'RESPONSE_FORMAT' });
  }

  const typeSupportsCharset = charsets === undefined ||
    charsets.includes(charset);

  if (!typeSupportsCharset) {
    const message = `Unsupported response charset with a ${title} content type: '${charset}'`;
    throwError(message, { reason: 'RESPONSE_FORMAT' });
  }
};

module.exports = {
  parseFormatCharset,
};
