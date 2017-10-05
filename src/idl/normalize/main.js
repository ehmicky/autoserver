'use strict';

const { reduceAsync, mapValues } = require('../../utilities');

const { normalizers } = require('./list');

// Normalize IDL definition
const normalizeIdl = function ({ idl, path }) {
  return reduceAsync(
    normalizers,
    applyNormalizer.bind(null, { path }),
    idl,
  );
};

// Apply each normalizer in order
const applyNormalizer = function ({ path }, idl, { type, func }) {
  return normalizeFuncs[type](func, { idl, path });
};

// Apply a mapping function on the full IDL
const normalizeFull = function (func, { idl, path }) {
  return func({ idl, path });
};

// Apply a mapping function on each model
const normalizeModels = function (func, { idl, idl: { models } }) {
  const modelsA = mapValues(
    models,
    (model, modelName) => func(model, { modelName, idl }),
  );
  return { ...idl, models: modelsA };
};

// Apply a mapping function on each model's attribute
const normalizeAllAttrs = function (func, { idl }) {
  return normalizeModels(
    model => normalizeAttrs({ func, model, idl }),
    { idl },
  );
};

const normalizeAttrs = function ({ func, model, idl }) {
  const { attributes } = model;
  if (!attributes) { return model; }

  const attributesA = mapValues(
    attributes,
    (attr, attrName) => func(attr, { attrName, idl }),
  );
  return { ...model, attributes: attributesA };
};

// Normalizer can either transform the full IDL, each model or each attribute
const normalizeFuncs = {
  idl: normalizeFull,
  model: normalizeModels,
  attr: normalizeAllAttrs,
};

module.exports = {
  normalizeIdl,
};
