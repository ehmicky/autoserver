'use strict';

const { omit } = require('../../../../../utilities');
const { getSubDef, isMultiple } = require('../utilities');

// Merge nested models, i.e. attributes with `model` defined,
// with the model they refer to
const getNestedIdAttr = function ({ childDef, childDefName }) {
  const nestedId = getNestedId({ childDef });
  return { [childDefName]: nestedId };
};

const getNestedId = function ({ childDef }) {
  const subDef = getSubDef(childDef);
  const multiple = isMultiple(childDef);

  // Make sure isModel(nestedId) returns false
  const nestedIdDef = omit(subDef, 'model');

  if (multiple) {
    return Object.assign({}, childDef, { items: nestedIdDef });
  }

  return nestedIdDef;
};

module.exports = {
  getNestedIdAttr,
};
