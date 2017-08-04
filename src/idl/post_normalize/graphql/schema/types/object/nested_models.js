'use strict';

const { getAttrFieldName } = require('../../name');

const getNestedModels = function ({ fields, opts }) {
  return Object.entries(fields)
    .map(([defName, def]) => getNestedModel({ def, defName, opts }))
    .reduce((memo, value) => Object.assign({}, memo, ...value), {});
};

const getNestedModel = function ({
  def,
  defName,
  opts: { inputObjectType, topDef },
}) {
  const originalAttr = { [defName]: { ...def, typeName: defName } };

  // Only for nested models, that are not data|filter arguments
  const isNormalNested = def.target !== undefined &&
    inputObjectType === undefined;
  if (!isNormalNested) { return [originalAttr]; }

  const nestedModel = getRecursiveModel({ def, defName, topDef });
  return [originalAttr, nestedModel];
};

// Copy nested models with a different name that includes the action,
// e.g. `my_attribute` -> `createMyAttribute`
const getRecursiveModel = function ({ def, def: { action }, defName, topDef }) {
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

const findTopLevelModel = function ({ def: { target, action }, topDef }) {
  const [typeName, topLevelModel] = Object.entries(topDef.attributes)
    .find(([, attr]) => attr.model === target && attr.action === action);
  return { ...topLevelModel, typeName };
};

module.exports = {
  getNestedModels,
};
