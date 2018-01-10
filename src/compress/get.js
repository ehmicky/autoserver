'use strict';

const { getAdapter } = require('../adapters');

const { DEFAULT_ALGO } = require('./constants');
const { compressAdapters } = require('./wrap');

// Retrieves compression adapter
const getAlgo = function (algo = DEFAULT_ALGO.name) {
  const algoA = algo.trim().toLowerCase();

  const compressAdapter = getAdapter({
    adapters: compressAdapters,
    key: algoA,
    name: 'compression algorithm',
  });
  return compressAdapter;
};

// Check if compression algorithm is among the adapters
const hasAlgo = function (algo) {
  return compressAdapters[algo] !== undefined;
};

module.exports = {
  getAlgo,
  hasAlgo,
};
