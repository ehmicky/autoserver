'use strict';

const { promisify } = require('util');
const { gzip, gunzip } = require('zlib');

const pGzip = promisify(gzip);
const pGunzip = promisify(gunzip);

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
