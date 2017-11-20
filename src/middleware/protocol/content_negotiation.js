'use strict';

const { encodingExists } = require('iconv-lite');

const { omit } = require('../../utilities');
const { throwError } = require('../../error');
const { formatHandlers, DEFAULT_FORMAT } = require('../../formats');
const { compressHandlers } = require('../../compress');

// Retrieve format|charset|compress of the response payloads, and
// charset of the request payload
const handleContentNegotiation = function ({
  queryvars,
  format,
  charset,
  compress,
}) {
  const formatA = getFormat({ queryvars, format });
  const charsetA = getCharset({ queryvars, charset, format: formatA });
  const compressA = getCompress({ queryvars, compress });

  const queryvarsA = omit(queryvars, ['format', 'charset', 'compress']);

  return {
    queryvars: queryvarsA,
    format: formatA,
    charset: charsetA,
    compress: compressA,
  };
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
  format = DEFAULT_FORMAT,
  format: { charsets = [] } = DEFAULT_FORMAT,
}) {
  // E.g. charset in Content-Type HTTP header
  const charsetA = charset ||
    // ?charset query variable
    queryvars.charset ||
    // Charset specified by this format
    charsets[0];
  if (charsetA === undefined) { return; }

  const charsetB = charsetA.toLowerCase();

  validateCharset({ charset: charsetB, format });

  return charsetB;
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

// Compression is only for the responses.
// It could theoritically be for the request, but request body compression is
// rarely used in real life. Also, it would require splitting the `compress`
// parameter into two (one for input, one for output)
const getCompress = function ({ queryvars, compress }) {
  // E.g. in Accept-Encoding HTTP header
  const compressA = compress ||
    // ?compress query variable
    queryvars.compress;
  if (compressA === undefined) { return; }

  const compressB = compressA.toLowerCase();

  const compressC = compressHandlers[compressB];
  if (compressC !== undefined) { return compressC; }

  const message = `Unsupported compression: '${compressA}'`;
  throwError(message, { reason: 'RESPONSE_FORMAT' });
};

module.exports = {
  handleContentNegotiation,
};
