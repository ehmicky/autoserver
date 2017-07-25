'use strict';

const {
  transformModels,
  transformAttributes,
  normalizeAllTransforms,
  normalizeAliases,
} = require('./normalizers');

const normalizers = [
  transformModels,
  transformAttributes,
  normalizeAllTransforms,
  normalizeAliases,
];

// Normalize IDL definition models
const normalizeModels = function ({ idl: oIdl }) {
  return Object.values(normalizers).reduce(
    (idl, normalizer) => {
      const models = normalizer({ idl });
      return Object.assign({}, idl, { models });
    },
    oIdl,
  );
};

module.exports = {
  normalizeModels,
};
