'use strict';

// No compression
const compress = function ({ content }) {
  return content;
};

const decompress = function ({ content }) {
  return content;
};

module.exports = {
  name: 'identity',
  title: 'No compression',
  compress,
  decompress,
};
