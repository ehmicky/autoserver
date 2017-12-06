'use strict';

const { pDeflate, pInflate } = require('../../utilities');

// Compress to Deflate
const compress = function ({ content }) {
  return pDeflate(content);
};

// Decompress from Deflate
const decompress = function ({ content }) {
  return pInflate(content);
};

module.exports = {
  name: 'deflate',
  title: 'Deflate',
  compress,
  decompress,
};
