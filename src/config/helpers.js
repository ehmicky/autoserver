'use strict';

const { mapValues, pickBy } = require('../utilities');

// Apply a mapping function on each collection
const mapColls = function (func, { config, config: { collections } }) {
  const collectionsA = mapValues(
    collections,
    (coll, collname) => mapColl({ func, coll, collname, config }),
  );
  return { collections: collectionsA };
};

const mapColl = function ({ func, coll, collname, config }) {
  const collA = func({ coll, collname, config });
  return { ...coll, ...collA };
};

// Apply a mapping function on each collection's attribute
const mapAttrs = function (func, { config }) {
  const funcA = mapCollAttrs.bind(null, func);
  return mapColls(funcA, { funcA, config });
};

const mapCollAttrs = function (
  func,
  { coll, coll: { attributes }, collname, config },
) {
  if (attributes === undefined) { return; }

  const attributesA = mapValues(
    attributes,
    (attr, attrName) => mapAttr({
      func,
      attr,
      attrName,
      coll,
      collname,
      config,
    }),
  );
  return { attributes: attributesA };
};

const mapAttr = function ({ func, attr, attrName, coll, collname, config }) {
  const attrA = func({ attr, attrName, coll, collname, config });
  return { ...attr, ...attrA };
};

// Create shortcuts map by iterating over each collection and its attributes
const getShortcut = function ({ filter, mapper, config: { collections } }) {
  return mapValues(
    collections,
    ({ attributes = {} }) => getShortcutColl({ attributes, filter, mapper }),
  );
};

const getShortcutColl = function ({ attributes, filter, mapper }) {
  const attributesA = pickBy(
    attributes,
    attr => Object.keys(attr).includes(filter),
  );
  const attributesB = mapValues(attributesA, mapper);
  return attributesB;
};

module.exports = {
  mapColls,
  mapAttrs,
  getShortcut,
};
