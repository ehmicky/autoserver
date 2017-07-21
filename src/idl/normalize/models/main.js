'use strict';

const normalizers = require('./normalizers');

// Normalize IDL definition models
const normalizeModels = function ({ idl, idl: { models: oModels } }) {
  const newModels = Object.values(normalizers).reduce(
    (models, normalizer) => normalizer({ idl, models }),
    oModels,
  );

  const newIdl = Object.assign({}, idl, { models: newModels });
  return newIdl;
};

module.exports = {
  normalizeModels,
};
