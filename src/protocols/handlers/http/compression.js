'use strict';

const { createInflate, createGunzip } = require('zlib');

const { throwError } = require('../../../error');

// Handle HTTP decompression
const handleDecompression = function ({ specific, specific: { req } }) {
  const encoding = getContentEncoding({ specific });
  if (!encoding) { return req; }

  const decompressionHandler = decompressionHandlers[encoding.toLowerCase()];

  if (decompressionHandler === undefined) {
    const message = `HTTP Content-Encoding ${encoding} is not supported`;
    throwError(message, { reason: 'REQUEST_FORMAT' });
  }

  const reqA = decompressionHandler({ req });
  return reqA;
};

// Retrieves payload decompression algorithm
const getContentEncoding = function ({ specific: { req: { headers } } }) {
  return headers['content-encoding'];
};

const deflateReq = function ({ req }) {
  return req.pipe(createInflate());
};

const gunzipReq = function ({ req }) {
  return req.pipe(createGunzip());
};

const identityReq = function ({ req }) {
  return req;
};

const decompressionHandlers = {
  deflate: deflateReq,
  gunzip: gunzipReq,
  identity: identityReq,
};

module.exports = {
  handleDecompression,
};
