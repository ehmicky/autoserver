'use strict';

const { mapModels } = require('./map_helper');

// Gets a map of models' `transform` or `compute`
// e.g. { my_model: [{ attrName, transform }, ...], ... }
const getTransformsMap = function ({ idl: { models }, type }) {
  return mapModels({
    models,
    filter: type,
    mapProps: mapProps.bind(null, type),
  });
};

const mapProps = function (type, props, { transformOrder }) {
  const newProps = Object.entries(props)
    .map(([attrName, { [type]: transform }]) => ({ attrName, transform }));
  const sortedProps = sortProps({ props: newProps, transformOrder });
  return sortedProps;
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
