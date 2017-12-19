'use strict';

const { compressAdapters } = require('./merger');

// Possible compression algorithms
const getNames = function () {
  return Object.values(compressAdapters)
    .map(({ name }) => name)
    .join(', ');
};

// Check if compression algorithm is among the adapters
const isSupported = function (name) {
  return compressAdapters[name] !== undefined;
};

module.exports = {
  getNames,
  isSupported,
};
