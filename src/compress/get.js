'use strict';

const { DEFAULT_ALGO } = require('./constants');
const { compressAdapters } = require('./wrap');

// Retrieves compression algo
const getAlgo = function (algo = DEFAULT_ALGO.name) {
  const algoA = algo.trim().toLowerCase();
  const algoB = compressAdapters[algoA];
  if (algoB !== undefined) { return algoB.wrapped; }

  const message = `Unsupported compression algorithm: '${algo}'`;
  // eslint-disable-next-line fp/no-throw
  throw new Error(message);
};

// Check if compression algorithm is among the adapters
const hasAlgo = function (algo) {
  return compressAdapters[algo] !== undefined;
};

module.exports = {
  getAlgo,
  hasAlgo,
};
