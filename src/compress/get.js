'use strict';

const { getAdapter } = require('../adapters');

const { compressAdapters } = require('./wrap');

// Retrieves compression adapter
const getAlgo = function (algo = 'identity') {
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

const DEFAULT_ALGO = getAlgo('identity');

module.exports = {
  getAlgo,
  hasAlgo,
  DEFAULT_ALGO,
};
