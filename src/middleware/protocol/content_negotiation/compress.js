'use strict';

const { throwError } = require('../../../error');
const { compressHandlers } = require('../../../compress');

// Retrieve compression asked by client for the response payload
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
  getCompress,
};
