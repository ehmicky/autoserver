'use strict';

const { compressAdapters } = require('./wrap');

// Possible compression algorithms
const getAlgos = function () {
  return Object.values(compressAdapters).map(({ name }) => name);
};

const ALGOS = getAlgos();

const CONSTANTS = {
  DEFAULT_ALGO: compressAdapters.identity.wrapped,

  ALGOS,
};

module.exports = CONSTANTS;
