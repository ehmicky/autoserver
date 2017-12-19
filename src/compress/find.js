'use strict';

const compressible = require('compressible');

const { compressAdapters } = require('./merger');

// Possible compression algorithms
const getNames = function () {
  return Object.values(compressAdapters)
    .map(({ name }) => name)
    .join(', ');
};

// Check if compression algorithm is among the adapters
const isSupported = function (algo) {
  return compressAdapters[algo] !== undefined;
};

// Do not try to compress binary content types
const shouldCompress = function ({ contentType }) {
  return compressible(contentType);
};

module.exports = {
  getNames,
  isSupported,
  shouldCompress,
};
