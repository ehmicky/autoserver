'use strict';

const { pick, omit } = require('../../../../../utilities');
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
  const topLevelModel = Object.values(rootDef.properties).find(prop =>
    prop.model === childDef.model &&
    prop.action.type === action.type &&
    prop.action.multiple === childDef.multiple
  );

  // Keep metadata of nested model, if defined
  const childDefMetadata = pick(childDef, metadataProps);
  const topLevelModelA = omit(topLevelModel, metadataProps);

  const recursiveDef = { ...topLevelModelA, ...childDefMetadata };

  return removeTopLevel({ def: recursiveDef });
};

const metadataProps = [
  'description',
  'deprecated',
  'examples',
];

// Distinguish top-level from nested models with `isTopLevel` true|false
const removeTopLevel = function ({ def }) {
  return { ...def, isTopLevel: false };
};

module.exports = {
  getNestedModels,
};
