'use strict';

const { sortArray } = require('../../../../utilities');

const mapAttrs = function (type, attrs, { transformOrder }) {
  const attrsA = Object.entries(attrs)
    .map(([attrName, { [type]: transform }]) => ({ attrName, transform }));
  const attrsB = sortAttrs({ attrs: attrsA, transformOrder });
  return attrsB;
};

// Sort transforms according to `using` property
const sortAttrs = function ({ attrs, transformOrder }) {
  return sortArray(attrs, (first, second) => {
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
  mapAttrs: mapAttrs.bind(null, type),
});
const transformsMap = getTransformsMap('transform');
const computesMap = getTransformsMap('compute');

module.exports = {
  transformsMap,
  computesMap,
};
