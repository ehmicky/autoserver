'use strict';

const { DEFAULT_ALGO } = require('./constants');

// Normalizes compression algo
const normalizeAlgo = function ({ algo }) {
  if (algo === undefined) { return DEFAULT_ALGO; }

  const algoA = algo.trim().toLowerCase();
  return algoA;
};

module.exports = {
  normalizeAlgo,
};
