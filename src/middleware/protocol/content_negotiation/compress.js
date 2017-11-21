'use strict';

const { throwError } = require('../../../error');
const { compressHandlers } = require('../../../compress');

// Retrieve compression asked by client for the response and request payloads
const getCompress = function ({
  queryvars,
  compressResponse,
  compressRequest,
}) {
  const queryvarsA = parseQueryvars({ queryvars });
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

// Using query variable ?compress=REQUEST_COMPRESSION[,RESPONSE_COMPRESSION]
const parseQueryvars = function ({ queryvars: { compress } }) {
  if (compress === undefined) { return {}; }

  const [compressResponse, compressRequest] = compress.split(',');
  return { compressResponse, compressRequest };
};

const parseCompress = function ({ queryvars, compress, name, reason }) {
  // E.g. in Content-Encoding or Accept-Encoding HTTP header
  const compressA = compress ||
    // ?compress query variable
    queryvars[name];
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
