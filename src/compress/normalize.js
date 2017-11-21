'use strict';

const { DEFAULT_COMPRESS } = require('./merger');

// Normalize `compress` name
const normalizeCompress = function ({
  compressResponse: { name: compressResponse } = DEFAULT_COMPRESS,
  compressRequest: { name: compressRequest } = DEFAULT_COMPRESS,
}) {
  const compress = `${compressResponse},${compressRequest}`;
  return compress;
};

// Using query variable ?compress=REQUEST_COMPRESSION[,RESPONSE_COMPRESSION]
const denormalizeCompress = function ({ compress }) {
  if (compress === undefined) { return {}; }

  const [compressResponse, compressRequest] = compress.split(',');
  return { compressResponse, compressRequest };
};

module.exports = {
  normalizeCompress,
  denormalizeCompress,
};
