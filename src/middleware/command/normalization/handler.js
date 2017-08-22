'use strict';

const { normalizeOrderBy } = require('./order_by');

// Normalize input, i.e. when input can take several shapes,
// reduce it to a single shape
const normalization = function (input) {
  const inputB = normalizers.reduce(
    (inputA, normalizer) => normalizer({ input: inputA }),
    input,
  );

  return inputB;
};

const normalizers = [
  normalizeOrderBy,
];

module.exports = {
  normalization,
};
