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
  opts,
  opts: { inputObjectType },
}) {
  const originalAttr = { [defName]: def };

  // Only for nested models, that are not data|filter arguments
  const isNormalNested = def.target !== undefined &&
    inputObjectType === undefined;
  if (!isNormalNested) { return [originalAttr]; }

  const nestedModel = getRecursiveModel({ def, defName, opts });
  return [originalAttr, nestedModel];
};

// Copy nested models with a different name that includes the command,
// e.g. `my_attribute` -> `createMyAttribute`
const getRecursiveModel = function ({ def, def: { command }, defName, opts }) {
  const recursiveDef = getRecursiveDef({ def, opts });
  const name = getAttrFieldName({ modelName: defName, command });
  return { [name]: recursiveDef };
};

const getRecursiveDef = function ({ def, opts }) {
  const topLevelModel = findTopLevelModel({ def, opts });

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
  def: { target, command },
  opts: { topDef },
}) {
  const [typeName, topLevelModel] = Object.entries(topDef.attributes)
    .find(([, attr]) => attr.model === target && attr.command === command);
  return { ...topLevelModel, typeName };
};

module.exports = {
  getNestedModels,
};
