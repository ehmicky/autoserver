'use strict';

const { getActionName } = require('../name');

const getNestedModels = function ({
  def,
  defName,
  inputObjectType,
  action,
  topDef,
}) {
  const originalAttr = { [defName]: def };
  // Only for nested models, that are not data|filter arguments
  const isNormalNested = def.target !== undefined &&
    inputObjectType === '';
  if (!isNormalNested) { return [originalAttr]; }

  const nestedModels = getRecursiveModels({ def, defName, action, topDef });
  return [originalAttr, nestedModels];
};

// Copy nested models with a different name that includes the action,
// e.g. `my_attribute` -> `createMyAttribute`
const getRecursiveModels = function ({ def, defName, action, topDef }) {
  const recursiveDef = getRecursiveDef({ def, action, topDef });
  const name = getActionName({ modelName: defName, action });
  return { [name]: recursiveDef };
};

const getRecursiveDef = function ({ def, action, topDef }) {
  const topLevelModel = findTopLevelModel({ def, action, topDef });

  // Recursive models use the description of:
  //  - the target model, if inputObjectType === 'data|filter'
  //  - the nested attribute, if inputObjectType ==== ''
  // We set the definition for the first case, and once they are built,
  // we use def.metadata to build the second case
  const { description, deprecation_reason: deprecationReason } = def;
  const metadata = { description, deprecationReason };

  return { ...topLevelModel, metadata };
};

const findTopLevelModel = function ({ def, action, topDef }) {
  return Object.values(topDef.attributes).find(attr =>
    attr.model === def.target &&
    attr.action.type === action.type &&
    attr.action.multiple === def.multiple
  );
};

module.exports = {
  getNestedModels,
};
