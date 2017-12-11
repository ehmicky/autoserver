'use strict';

const { mapValues } = require('../utilities');

// Apply a mapping function on each collection
const mapColls = function ({ func, schema, schema: { collections } }) {
  const collectionsA = mapValues(
    collections,
    (coll, collname) => func({ coll, collname, schema }),
  );
  return { ...schema, collections: collectionsA };
};

// Apply a mapping function on each collection's attribute
const mapAttrs = function ({ func, schema }) {
  const funcA = mapCollAttrs.bind(null, func);
  return mapColls({ func: funcA, schema });
};

const mapCollAttrs = function (func, { coll, collname, schema }) {
  const { attributes } = coll;
  if (attributes === undefined) { return coll; }

  const attributesA = mapValues(
    attributes,
    (attr, attrName) => func({ attr, attrName, coll, collname, schema }),
  );
  return { ...coll, attributes: attributesA };
};

module.exports = {
  mapColls,
  mapAttrs,
};
