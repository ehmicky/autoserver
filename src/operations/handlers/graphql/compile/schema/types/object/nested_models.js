'use strict';

// Create nested models definitions
const getNestedModel = function (def, { inputObjectType, topDef }) {
  const { target } = def;

  // Only for nested models, that are not data|filter arguments
  const isNested = target !== undefined && inputObjectType === 'type';
  if (!isNested) { return def; }

  const topLevelModel = Object.values(topDef.attributes)
    .find(({ model }) => model === target);

  // Recursive models use the description of:
  //  - the target model, if inputObjectType === 'data|filter'
  //  - the nested attribute, if inputObjectType ==== 'type'
  // We set the definition for the first case, and once they are built,
  // we use def.metadata to build the second case
  const { description, deprecation_reason: deprecationReason } = def;
  const metadata = { description, deprecationReason };

  return { ...topLevelModel, metadata };
};

module.exports = {
  getNestedModel,
};
