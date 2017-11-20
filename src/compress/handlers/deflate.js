'use strict';

const { pDeflate } = require('../../utilities');

// Compress to Deflate
const compress = function ({ content }) {
  return pDeflate(content);
};

module.exports = {
  name: 'deflate',
  title: 'Deflate',
  compress,
};
