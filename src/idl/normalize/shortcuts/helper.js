'use strict';

const { mapValues, pickBy } = require('../../../utilities');

// Create shortcuts maps by iterating over each model and its properties
// `filter` allow selecting properties
// `mapProps` allow modifying properties, as a whole
// `mapProp` allow modifying each individual property
const mapModels = function ({ models }, { filter, mapProps, mapProp }) {
  const filterFunc = getFilter({ filter });

  return mapValues(models, model => {
    const { properties = {} } = model;
    const props = pickBy(
      properties,
      (prop, propName) => filterFunc(prop, propName, model),
    );
    const mappedProps = mapProps ? mapProps(props, model) : props;
    const finalProps = mapProp
      ? mapValues(props, (prop, propName) => mapProp(prop, propName, model))
      : mappedProps;
    return finalProps;
  });
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
