'use strict';

const mapProps = function (type, props, { transformOrder }) {
  const propsA = Object.entries(props)
    .map(([attrName, { [type]: transform }]) => ({ attrName, transform }));
  const propsB = sortProps({ props: propsA, transformOrder });
  return propsB;
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

// Gets a map of models' `transform` or `compute`
// e.g. { my_model: [{ attrName, transform }, ...], ... }
const getTransformsMap = type => ({
  filter: type,
  mapProps: mapProps.bind(null, type),
});
const transformsMap = getTransformsMap('transform');
const computesMap = getTransformsMap('compute');

module.exports = {
  transformsMap,
  computesMap,
};
