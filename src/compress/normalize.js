'use strict';

const { DEFAULT_COMPRESS } = require('./merger');

// Normalize `compress` name
const normalizeCompress = function ({ compressResponse, compressRequest }) {
  const compressResponseName = getName({ compress: compressResponse });
  const compressRequestName = getName({ compress: compressRequest });

  const compress = `${compressResponseName},${compressRequestName}`;
  return compress;
};

const getName = function ({ compress }) {
  if (typeof compress === 'string' || compress == null) {
    return DEFAULT_COMPRESS.name;
  }

  return compress.name;
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
