'use strict';

const { reduceAsync, mapValues } = require('../../utilities');

const { normalizers } = require('./list');

// Normalize schema definition
const normalizeSchema = function ({ schema, path }) {
  return reduceAsync(
    normalizers,
    applyNormalizer.bind(null, { path }),
    schema,
  );
};

// Apply each normalizer in order
const applyNormalizer = function ({ path }, schema, { type, func }) {
  return normalizeFuncs[type](func, { schema, path });
};

// Apply a mapping function on the full schema
const normalizeFull = function (func, { schema, path }) {
  return func({ schema, path });
};

// Apply a mapping function on each model
const normalizeModels = function (func, { schema, schema: { models } }) {
  const modelsA = mapValues(
    models,
    (model, collname) => func(model, { collname, schema }),
  );
  return { ...schema, models: modelsA };
};

// Apply a mapping function on each model's attribute
const normalizeAllAttrs = function (func, { schema }) {
  return normalizeModels(
    model => normalizeAttrs({ func, model, schema }),
    { schema },
  );
};

const normalizeAttrs = function ({ func, model, schema }) {
  const { attributes } = model;
  if (!attributes) { return model; }

  const attributesA = mapValues(
    attributes,
    (attr, attrName) => func(attr, { attrName, schema }),
  );
  return { ...model, attributes: attributesA };
};

// Normalizer can either transform the full schema, each model or each attribute
const normalizeFuncs = {
  schema: normalizeFull,
  model: normalizeModels,
  attr: normalizeAllAttrs,
};

module.exports = {
  normalizeSchema,
};
