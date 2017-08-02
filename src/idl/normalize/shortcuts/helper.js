'use strict';

const { mapValues, pickBy } = require('../../../utilities');

// Create shortcuts maps by iterating over each model and its attributes
// `filter` allow selecting attributes
// `mapAttrs` allow modifying attributes, as a whole
// `mapAttr` allow modifying each individual attribute
const mapModels = function ({ models }, { filter, mapAttrs, mapAttr }) {
  const filterFunc = getFilter({ filter });

  return mapValues(
    models,
    model => mapModel({ model, filterFunc, mapAttrs, mapAttr }),
  );
};

const mapModel = function ({
  model,
  model: { attributes = {} },
  filterFunc,
  mapAttrs,
  mapAttr,
}) {
  const attributesA = pickBy(
    attributes,
    (attr, attrName) => filterFunc(attr, attrName, model),
  );
  const attributesB = mapAttr
    ? mapValues(attributesA, (attr, attrName) => mapAttr(attr, attrName, model))
    : attributesA;
  const attributesC = mapAttrs
    ? mapAttrs(attributesB, model)
    : attributesB;
  return attributesC;
};

const getFilter = function ({ filter = () => true }) {
  if (typeof filter === 'string') {
    return attrFilter.bind(null, filter);
  }

  return filter;
};

// Shortcut notation for `filter`
const attrFilter = function (attrName, model) {
  return model[attrName] !== undefined;
};

module.exports = {
  mapModels,
};
