'use strict';

const { pGzip } = require('../../utilities');

// Compress to Gzip
const compress = function ({ content }) {
  return pGzip(content);
};

module.exports = {
  name: 'gzip',
  title: 'Gzip',
  compress,
};
