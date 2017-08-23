'use strict';

const { normalizeOrderBy } = require('./order_by');

// Normalize input, i.e. when input can take several shapes,
// reduce it to a single shape
const normalization = function ({ args, modelName, idl }) {
  const argsB = normalizers.reduce(
    (argsA, normalizer) => normalizer(argsA, { modelName, idl }),
    args,
  );

  return { args: argsB };
};

const normalizers = [
  normalizeOrderBy,
];

module.exports = {
  normalization,
};
