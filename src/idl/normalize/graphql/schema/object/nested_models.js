'use strict';

const { getAttrFieldName } = require('../name');

const getNestedModels = function ({
  parentDef,
  def,
  defName,
  inputObjectType,
  topDef,
}) {
  const defA = { ...def, action: def.action || parentDef.action };

  const originalAttr = { [defName]: { ...defA, typeName: defName } };

  // Only for nested models, that are not data|filter arguments
  const isNormalNested = defA.target !== undefined &&
    inputObjectType === '';
  if (!isNormalNested) { return [originalAttr]; }

  const nestedModels = getRecursiveModels({ def: defA, defName, topDef });
  return [originalAttr, nestedModels];
};

// Copy nested models with a different name that includes the action,
// e.g. `my_attribute` -> `createMyAttribute`
const getRecursiveModels = function ({
  def,
  def: { action },
  defName,
  topDef,
}) {
  const recursiveDef = getRecursiveDef({ def, topDef });
  const name = getAttrFieldName({ modelName: defName, action });
  return { [name]: recursiveDef };
};

const getRecursiveDef = function ({ def, topDef }) {
  const topLevelModel = findTopLevelModel({ def, topDef });

  // Recursive models use the description of:
  //  - the target model, if inputObjectType === 'data|filter'
  //  - the nested attribute, if inputObjectType ==== ''
  // We set the definition for the first case, and once they are built,
  // we use def.metadata to build the second case
  const { description, deprecation_reason: deprecationReason } = def;
  const metadata = { description, deprecationReason };

  return { ...topLevelModel, metadata };
};

const findTopLevelModel = function ({
  def: { target, action, multiple },
  topDef,
}) {
  const [typeName, topLevelModel] = Object.entries(topDef.attributes)
    .find(([, attr]) =>
      attr.model === target &&
      attr.action.type === action.type &&
      attr.action.multiple === multiple
    );
  return { ...topLevelModel, typeName };
};

module.exports = {
  getNestedModels,
};
