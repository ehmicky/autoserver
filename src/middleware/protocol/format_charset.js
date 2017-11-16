'use strict';

const { encodingExists } = require('iconv-lite');

const { omit } = require('../../utilities');
const { throwError } = require('../../error');
const { formatHandlers, defaultFormat } = require('../../formats');

// Retrieve format and charset of both the request and response payloads
const parseFormatCharset = function ({ queryvars, format, charset }) {
  const formatA = getFormat({ queryvars, format });
  const charsetA = getCharset({ queryvars, charset, format: formatA });

  const queryvarsA = omit(queryvars, ['format', 'charset']);

  return { queryvars: queryvarsA, format: formatA, charset: charsetA };
};

const getFormat = function ({ queryvars, format }) {
  // E.g. MIME in Content-Type HTTP header
  const formatName = format ||
    // ?format query variable
    queryvars.format;
  if (formatName === undefined) { return; }

  const formatA = formatHandlers[formatName];
  if (formatA !== undefined) { return formatA; }

  const message = `Unsupported response format: '${formatName}'`;
  throwError(message, { reason: 'RESPONSE_FORMAT' });
};

const getCharset = function ({
  queryvars,
  charset,
  format = defaultFormat,
  format: { charsets = [] } = defaultFormat,
}) {
  // E.g. charset in Content-Type HTTP header
  const charsetA = charset ||
    // ?charset query variable
    queryvars.charset ||
    // Charset specified by this format
    charsets[0];
  if (charsetA === undefined) { return; }

  validateCharset({ charset: charsetA, format });

  const charsetB = charsetA.toLowerCase();
  return charsetB;
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
