'use strict';

const { omit } = require('../../../../../../../utilities');

// Create nested models definitions
const getNestedModel = function (def, { inputObjectType, topDef }) {
  const { target } = def;

  // Only for nested models, that are not data|filter arguments
  const isNested = target !== undefined && inputObjectType === 'type';
  if (!isNested) { return def; }

  const topLevelModel = Object.values(topDef.attributes)
    .find(({ model }) => model === target);
  // Command description is only used for Query|Mutation children,
  // not for recursive attributes, which use the normal `attr.description`
  const topLevelModelA = omit(topLevelModel, 'commandDescription');

  return topLevelModelA;
};

module.exports = {
  getNestedModel,
};
