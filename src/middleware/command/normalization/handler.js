'use strict';

const { normalizeOrderBy } = require('./order_by');

// Normalize input, i.e. when input can take several shapes,
// reduce it to a single shape
const normalization = function (nextFunc, input) {
  const inputB = normalizers.reduce(
    (inputA, normalizer) => normalizer({ input: inputA }),
    input,
  );

  return nextFunc(inputB);
};

const normalizers = [
  normalizeOrderBy,
];

module.exports = {
  normalization,
};
