'use strict';

const { transformLoggerFilters } = require('./logger_filters');

// Transform main options
const transformOptions = function (serverOpts) {
  return transformers.reduce(
    (serverOptsA, transformer) => transformer(serverOptsA),
    serverOpts,
  );
};

const transformers = [
  transformLoggerFilters,
];

module.exports = {
  transformOptions,
};
