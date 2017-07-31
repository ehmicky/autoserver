'use strict';

const { pick } = require('../../../../../utilities');
const { getActionName } = require('../name');
const { getSubDef, isModel, isMultiple } = require('../utilities');

const { getNestedIdAttr } = require('./nested_id');

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
  const subDef = getSubDef(childDef);
  return isModel(subDef) && !subDef.isTopLevel;
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
  const subDef = getSubDef(childDef);
  const multiple = isMultiple(childDef);

  const topLevelModel = Object.values(rootDef.properties)
    .find(prop => getSubDef(prop).model === subDef.model &&
      prop.action.type === action.type &&
      prop.action.multiple === multiple
    );

  // Keep metadata of nested model, if defined
  const childDefMetadata = pick(childDef, metadataProps);

  const recursiveDef = { ...topLevelModel, ...childDefMetadata };

  return removeTopLevel({ def: recursiveDef });
};

const metadataProps = [
  'description',
  'deprecated',
  'examples',
];

// Distinguish top-level from nested models with `isTopLevel` true|false
const removeTopLevel = function ({ def }) {
  const subDef = getSubDef(def);
  const multiple = isMultiple(def);

  const items = { ...subDef, isTopLevel: false };

  if (multiple) {
    return { ...def, items };
  }

  return items;
};

module.exports = {
  getNestedModels,
};
