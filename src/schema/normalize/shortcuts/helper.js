'use strict';

const { mapValues, pickBy } = require('../../../utilities');

// Create shortcuts maps by iterating over each collection and its attributes
// `filter` allow selecting attributes
// `mapColls` allow modifying all collections, as a whole
// `mapAttrs` allow modifying attributes, as a whole
// `mapAttr` allow modifying each individual attribute
const mapAllColls = function (
  { schema, schema: { collections } },
  { filter, mapColls, mapAttrs, mapAttr },
) {
  const filterFunc = getFilter({ filter });

  if (mapColls) {
    return applyMapColls({ mapColls, schema, collections });
  }

  return mapValues(
    collections,
    coll => mapColl({ coll, filterFunc, mapAttrs, mapAttr, schema }),
  );
};

const mapColl = function ({
  coll,
  coll: { attributes = {} },
  filterFunc,
  mapAttrs,
  mapAttr,
  schema,
}) {
  const attributesA = pickBy(
    attributes,
    (attr, attrName) => filterFunc(attr, { attrName, coll }),
  );
  const attributesB = applyMapAttr({
    mapAttr,
    attributes: attributesA,
    coll,
    schema,
  });
  const attributesC = applyMapAttrs({
    mapAttrs,
    attributes: attributesB,
    coll,
    schema,
  });
  return attributesC;
};

const applyMapAttr = function ({ mapAttr, attributes, coll, schema }) {
  if (mapAttr === undefined) { return attributes; }

  return mapValues(
    attributes,
    (attr, attrName) => mapAttr(attr, { coll, attrName, schema }),
  );
};

const applyMapAttrs = function ({ mapAttrs, attributes, coll, schema }) {
  if (mapAttrs === undefined) { return attributes; }

  return mapAttrs(attributes, { coll, schema });
};

const applyMapColls = function ({ mapColls, schema, collections }) {
  if (mapColls === undefined) { return collections; }

  return mapColls(collections, { schema });
};

const getFilter = function ({ filter = () => true }) {
  if (typeof filter === 'string') {
    return propFilter.bind(null, filter);
  }

  return filter;
};

// Shortcut notation for `filter`
const propFilter = function (propName, attr) {
  return Object.keys(attr).includes(propName);
};

module.exports = {
  mapAllColls,
};
