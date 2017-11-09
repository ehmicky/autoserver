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

// Apply a mapping function on each collection
const normalizeCollections = function (
  func,
  { schema, schema: { collections } },
) {
  const collectionsA = mapValues(
    collections,
    (coll, collname) => func(coll, { collname, schema }),
  );
  return { ...schema, collections: collectionsA };
};

// Apply a mapping function on each collection's attribute
const normalizeAllAttrs = function (func, { schema }) {
  return normalizeCollections(
    coll => normalizeAttrs({ func, coll, schema }),
    { schema },
  );
};

const normalizeAttrs = function ({ func, coll, schema }) {
  const { attributes } = coll;
  if (!attributes) { return coll; }

  const attributesA = mapValues(
    attributes,
    (attr, attrName) => func(attr, { attrName, schema }),
  );
  return { ...coll, attributes: attributesA };
};

// Normalizer can either transform the full schema, each collection
// or each attribute
const normalizeFuncs = {
  schema: normalizeFull,
  coll: normalizeCollections,
  attr: normalizeAllAttrs,
};

module.exports = {
  normalizeSchema,
};
