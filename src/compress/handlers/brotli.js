'use strict';

const { pBrotliCompress, pBrotliDecompress } = require('../../utilities');

// Compress to Brotli
const compress = async function ({ content }) {
  const contentA = Buffer.from(content);
  const contentB = await pBrotliCompress(contentA);
  const contentC = contentB.toString();
  return contentC;
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
