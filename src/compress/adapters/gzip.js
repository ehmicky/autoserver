'use strict';

const { pGzip, pGunzip } = require('../../utilities');

// Compress to Gzip
const compress = function ({ content }) {
  return pGzip(content);
};

// Decompress from Gzip
const decompress = function ({ content }) {
  return pGunzip(content);
};

module.exports = {
  name: 'gzip',
  title: 'Gzip',
  compress,
  decompress,
};
