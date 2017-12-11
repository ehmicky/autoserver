'use strict';

const { mapValues } = require('../utilities');

// Apply a mapping function on each collection
const mapColls = function ({ func, schema, schema: { collections } }) {
  const collectionsA = mapValues(
    collections,
    (coll, collname) => mapColl({ func, coll, collname, schema }),
  );
  return { collections: collectionsA };
};

const mapColl = function ({ func, coll, collname, schema }) {
  const collA = func({ coll, collname, schema });
  return { ...coll, ...collA };
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
    (attr, attrName) => mapAttr({
      func,
      attr,
      attrName,
      coll,
      collname,
      schema,
    }),
  );
  return { attributes: attributesA };
};

const mapAttr = function ({ func, attr, attrName, coll, collname, schema }) {
  const attrA = func({ attr, attrName, coll, collname, schema });
  return { ...attr, ...attrA };
};

module.exports = {
  mapColls,
  mapAttrs,
};
