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
  return props.sort((first, second) => {
    const indexFirst = transformOrder.indexOf(first.attrName);
    const indexSecond = transformOrder.indexOf(second.attrName);
    if (indexFirst > indexSecond) { return 1; }
    if (indexFirst < indexSecond) { return -1; }
    return 0;
  });
};

module.exports = {
  getTransformsMap,
};
