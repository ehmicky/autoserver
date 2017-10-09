'use strict';

const { mapValues, pickBy } = require('../../../utilities');

// Create shortcuts maps by iterating over each model and its attributes
// `filter` allow selecting attributes
// `mapAttrs` allow modifying attributes, as a whole
// `mapAttr` allow modifying each individual attribute
const mapModels = function ({ schema }, { filter, mapAttrs, mapAttr }) {
  const filterFunc = getFilter({ filter });

  return mapValues(
    schema.models,
    model => mapModel({ model, filterFunc, mapAttrs, mapAttr, schema }),
  );
};

const mapModel = function ({
  model,
  model: { attributes = {} },
  filterFunc,
  mapAttrs,
  mapAttr,
  schema,
}) {
  const attributesA = pickBy(
    attributes,
    (attr, attrName) => filterFunc(attr, { attrName, model }),
  );
  const attributesB = mapAttr
    ? mapValues(
      attributesA,
      (attr, attrName) => mapAttr(attr, { model, attrName, schema }),
    )
    : attributesA;
  const attributesC = mapAttrs
    ? mapAttrs(attributesB, { model, schema })
    : attributesB;
  return attributesC;
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
  mapModels,
};
