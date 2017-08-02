'use strict';

const { omit } = require('../../../../../utilities');
const { getActionName } = require('../name');

const getNestedModels = function ({
  childDef,
  childDefName,
  inputObjectType,
  action,
  rootDef,
}) {
  const originalAttr = { [childDefName]: childDef };
  if (!isNestedModel({ childDef })) { return [originalAttr]; }

  const nestedId = getNestedIdAttr({ childDef, childDefName });
  const nestedModels = getRecursiveModels({
    childDef,
    childDefName,
    inputObjectType,
    action,
    rootDef,
  });
  return [nestedId, nestedModels];
};

const isNestedModel = function ({ childDef }) {
  return childDef.model !== undefined && !childDef.isTopLevel;
};

// Merge nested models, i.e. attributes with `model` defined,
// with the model they refer to
const getNestedIdAttr = function ({ childDef, childDefName }) {
  const nestedId = omit(childDef, 'model');
  return { [childDefName]: nestedId };
};

// Copy nested models with a different name that includes the action,
// e.g. `my_attribute` -> `createMyAttribute`
const getRecursiveModels = function ({
  childDef,
  childDefName,
  inputObjectType,
  action,
  rootDef,
}) {
  // Not for data|filter arguments
  if (inputObjectType !== '') { return; }

  const recursiveDef = getRecursiveDef({ childDef, action, rootDef });
  const name = getActionName({ modelName: childDefName, action });
  return { [name]: recursiveDef };
};

const getRecursiveDef = function ({ childDef, action, rootDef }) {
  const topLevelModel = findTopLevelModel({ childDef, action, rootDef });

  // Recursive models use the description of:
  //  - the target model, if inputObjectType === 'data|filter'
  //  - the nested attribute, if inputObjectType ==== ''
  // We set the definition for the first case, and once they are built,
  // we use def.metadata to build the second case
  const { description, deprecated } = childDef;
  const metadata = { description, deprecated };
  const topLevelModelA = { ...topLevelModel, metadata };

  return removeTopLevel({ def: topLevelModelA });
};

const findTopLevelModel = function ({ childDef, action, rootDef }) {
  return Object.values(rootDef.properties).find(prop =>
    prop.model === childDef.model &&
    prop.action.type === action.type &&
    prop.action.multiple === childDef.multiple
  );
};

// Distinguish top-level from nested models with `isTopLevel` true|false
const removeTopLevel = function ({ def }) {
  return { ...def, isTopLevel: false };
};

module.exports = {
  getNestedModels,
};
