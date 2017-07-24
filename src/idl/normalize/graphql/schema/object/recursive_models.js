'use strict';

const { getSubDef, isModel, isMultiple } = require('../utilities');

// Merge nested models, i.e. attributes with `model` defined, with
// the model they refer to
const getRecursiveModels = function ({ childDef, rootDef }) {
  const subDef = getSubDef(childDef);
  if (!isModel(subDef) || subDef.isTopLevel) { return childDef; }

  const topLevelModel = Object.values(rootDef.properties)
    .find(prop => prop.model === subDef.model);
  const nestedChildDef = Object.assign(
    {},
    topLevelModel,
    subDef,
    { isTopLevel: false },
  );

  if (isMultiple(childDef)) {
    return Object.assign({}, childDef, { items: nestedChildDef });
  }

  return nestedChildDef;
};

module.exports = {
  getRecursiveModels,
};
