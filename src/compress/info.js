'use strict';

const compressible = require('compressible');

// Do not try to compress binary content types
const shouldCompress = function ({ contentType }) {
  return compressible(contentType);
};

module.exports = {
  shouldCompress,
};
