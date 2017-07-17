'use strict';

const { mapValues, pickBy } = require('../../utilities');

// Gets a map of models' `transform` or `compute`
// e.g. { my_model: [{ attrName, transform }, ...], ... }
const getTransformsMap = function ({ idl: { models }, type }) {
  return mapValues(models, ({ transformOrder, properties = {} }) => {
    const typedProperties = pickBy(properties, prop => prop[type]);
    const props = Object.entries(typedProperties)
      .map(([attrName, prop]) => ({ attrName, transform: prop[type] }));
    const sortedProps = sortProps({ props, transformOrder });
    return sortedProps;
  });
};

// Sort transforms according to `using` property
const sortProps = function ({ props, transformOrder }) {
  return props.sort((a, b) => {
    const indexA = transformOrder.indexOf(a.attrName);
    const indexB = transformOrder.indexOf(b.attrName);
    return indexA > indexB ? 1 : indexA < indexB ? -1 : 0;
  });
};

module.exports = {
  getTransformsMap,
};
