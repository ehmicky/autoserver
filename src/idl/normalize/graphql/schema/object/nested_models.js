'use strict';

const { omit } = require('../../../../../utilities');
const { getActionName } = require('../name');

const getNestedModels = function ({
  childDef,
  childDefName,
  inputObjectType,
  action,
  topDef,
}) {
  const originalAttr = { [childDefName]: childDef };
  if (!isNestedModel({ childDef })) { return [originalAttr]; }

  const nestedId = getNestedIdAttr({ childDef, childDefName });
  const nestedModels = getRecursiveModels({
    childDef,
    childDefName,
    inputObjectType,
    action,
    topDef,
  });
  return [nestedId, nestedModels];
};

const isNestedModel = function ({ childDef }) {
  return childDef.target !== undefined && !childDef.isTopLevel;
};

// Merge nested models, i.e. attributes with `target` defined,
// with the model they refer to
const getNestedIdAttr = function ({ childDef, childDefName }) {
  const nestedId = omit(childDef, 'target');
  return { [childDefName]: nestedId };
};

// Copy nested models with a different name that includes the action,
// e.g. `my_attribute` -> `createMyAttribute`
const getRecursiveModels = function ({
  childDef,
  childDefName,
  inputObjectType,
  action,
  topDef,
}) {
  // Not for data|filter arguments
  if (inputObjectType !== '') { return; }

  const recursiveDef = getRecursiveDef({ childDef, action, topDef });
  const name = getActionName({ modelName: childDefName, action });
  return { [name]: recursiveDef };
};

const getRecursiveDef = function ({ childDef, action, topDef }) {
  const topLevelModel = findTopLevelModel({ childDef, action, topDef });

  // Recursive models use the description of:
  //  - the target model, if inputObjectType === 'data|filter'
  //  - the nested attribute, if inputObjectType ==== ''
  // We set the definition for the first case, and once they are built,
  // we use def.metadata to build the second case
  const { description, deprecation_reason: deprecationReason } = childDef;
  const metadata = { description, deprecationReason };
  const topLevelModelA = { ...topLevelModel, metadata };

  return removeTopLevel({ def: topLevelModelA });
};

const findTopLevelModel = function ({ childDef, action, topDef }) {
  return Object.values(topDef.attributes).find(attr =>
    attr.model === childDef.target &&
    attr.action.type === action.type &&
    attr.action.multiple === childDef.multiple
  );
};

// Distinguish top-level from nested models with `isTopLevel` true|false
const removeTopLevel = function ({ def }) {
  return { ...def, isTopLevel: false };
};

module.exports = {
  getNestedModels,
};
