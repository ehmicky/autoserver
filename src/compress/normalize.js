'use strict';

const { DEFAULT_COMPRESS } = require('./merger');

// Normalize `compress` name
const normalizeCompress = function ({
  compressResponse: { name: compressResponse } = DEFAULT_COMPRESS,
  compressRequest: { name: compressRequest } = DEFAULT_COMPRESS,
}) {
  return `${compressResponse},${compressRequest}`;
};

module.exports = {
  normalizeCompress,
};
