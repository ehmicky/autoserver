'use strict';

const { omit } = require('../../../../../../../utilities');

// Create nested models definitions
const getNestedModel = function (def, { inputObjectType, topDef }) {
  const { target } = def;

  // Only for nested models, that are not filter arguments
  const isNested = target !== undefined && inputObjectType !== 'filter';
  if (!isNested) { return def; }

  const topLevelModel = Object.values(topDef.attributes)
    .find(topLevelModelMatches.bind(null, def));
  // Command description is only used for Query|Mutation children,
  // not for recursive attributes, which use the normal `attr.description`
  const topLevelModelA = omit(topLevelModel, 'commandDescription');

  return topLevelModelA;
};

const topLevelModelMatches = function (
  { target, isArray, command: { type: commandType } },
  { model, command },
) {
  return model === target &&
    command.multiple === isArray &&
    command.type === commandType;
};

module.exports = {
  getNestedModel,
};
