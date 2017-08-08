'use strict';

const mapAttr = (type, attr) => attr[type];

// Gets a map of models' `transform` or `compute`
// e.g. { my_model: { attrName: transform, ... }, ... }
const getTransformsMap = type => ({
  filter: type,
  mapAttr: mapAttr.bind(null, type),
});
const transformsMap = getTransformsMap('transform');
const computesMap = getTransformsMap('compute');

module.exports = {
  transformsMap,
  computesMap,
};
