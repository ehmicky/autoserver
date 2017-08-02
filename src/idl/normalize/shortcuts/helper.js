'use strict';

const { mapValues, pickBy } = require('../../../utilities');

// Create shortcuts maps by iterating over each model and its properties
// `filter` allow selecting properties
// `mapProps` allow modifying properties, as a whole
// `mapProp` allow modifying each individual property
const mapModels = function ({ models }, { filter, mapProps, mapProp }) {
  const filterFunc = getFilter({ filter });

  return mapValues(
    models,
    model => mapModel({ model, filterFunc, mapProps, mapProp }),
  );
};

const mapModel = function ({
  model,
  model: { properties = {} },
  filterFunc,
  mapProps,
  mapProp,
}) {
  const propertiesA = pickBy(
    properties,
    (prop, propName) => filterFunc(prop, propName, model),
  );
  const propertiesB = mapProp
    ? mapValues(propertiesA, (prop, propName) => mapProp(prop, propName, model))
    : propertiesA;
  const propertiesC = mapProps
    ? mapProps(propertiesB, model)
    : propertiesB;
  return propertiesC;
};

const getFilter = function ({ filter = () => true }) {
  if (typeof filter === 'string') {
    return attrFilter.bind(null, filter);
  }

  return filter;
};

// Shortcut notation for `filter`
const attrFilter = function (attrName, prop) {
  return prop[attrName] !== undefined;
};

module.exports = {
  mapModels,
};
