'use strict';

const mapAttr = (type, attr) => attr[type];

// Gets a map of models' `transform`, `value` or `compute`
// e.g. { my_model: { attrName: transform, ... }, ... }
const getTransformsMap = type => ({
  filter: type,
  mapAttr: mapAttr.bind(null, type),
});
const transformsMap = getTransformsMap('transform');
const computesMap = getTransformsMap('compute');
const valuesMap = getTransformsMap('value');

module.exports = {
  transformsMap,
  computesMap,
  valuesMap,
};
