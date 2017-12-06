'use strict';

const { pBrotliCompress, pBrotliDecompress } = require('../../utilities');

// Compress to Brotli
const compress = function ({ content }) {
  return pBrotliCompress(content);
};

// Decompress from Brotli
const decompress = function ({ content }) {
  return pBrotliDecompress(content);
};

module.exports = {
  name: 'br',
  title: 'Brotli',
  compress,
  decompress,
};
