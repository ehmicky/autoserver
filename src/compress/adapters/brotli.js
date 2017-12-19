'use strict';

const { promisify } = require('util');

const {
  compress: brotliCompress,
  decompress: brotliDecompress,
} = require('iltorb');

const pBrotliCompress = promisify(brotliCompress);
const pBrotliDecompress = promisify(brotliDecompress);

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
