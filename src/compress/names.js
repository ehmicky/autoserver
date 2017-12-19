'use strict';

const { compressAdapters } = require('./merger');

// Possible compression algorithms
const getNames = function () {
  return Object.values(compressAdapters)
    .map(({ name }) => name)
    .join(', ');
};

module.exports = {
  getNames,
};
