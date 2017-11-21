'use strict';

const { throwError } = require('../../../error');
const { compressHandlers, denormalizeCompress } = require('../../../compress');

// Retrieve compression asked by client for the response and request payloads
const getCompress = function ({
  queryvars: { compress },
  compressResponse,
  compressRequest,
}) {
  const queryvarsA = denormalizeCompress({ compress });

  const compressResponseA = parseCompress({
    queryvars: queryvarsA,
    compress: compressResponse,
    name: 'compressResponse',
    reason: 'RESPONSE_FORMAT',
  });
  const compressRequestA = parseCompress({
    queryvars: queryvarsA,
    compress: compressRequest,
    name: 'compressRequest',
    reason: 'REQUEST_FORMAT',
  });

  return {
    compressResponse: compressResponseA,
    compressRequest: compressRequestA,
  };
};

const parseCompress = function ({ queryvars, compress, name, reason }) {
  // ?compress query variable
  const compressA = queryvars[name] ||
    // E.g. in Content-Encoding or Accept-Encoding HTTP header
    compress;
  if (compressA === undefined) { return; }

  const compressB = compressA.trim().toLowerCase();

  const compressC = compressHandlers[compressB];
  if (compressC !== undefined) { return compressC; }

  const message = `Unsupported compression: '${compressA}'`;
  throwError(message, { reason });
};

module.exports = {
  getCompress,
};
