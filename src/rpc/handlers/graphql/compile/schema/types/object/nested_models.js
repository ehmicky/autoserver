'use strict';

const { omit } = require('../../../../../../../utilities');

// Create nested models definitions
const getNestedModel = function (def, { inputObjectType, topDef }) {
  const { target, isArray } = def;

  // Only for nested models, that are not filter arguments
  const isNested = target !== undefined && inputObjectType !== 'filter';
  if (!isNested) { return def; }

  const topLevelModel = Object.values(topDef.attributes)
    .find(topDefA => topLevelModelMatches(def, topDefA));
  // Command description is only used for Query|Mutation children,
  // not for recursive attributes, which use the normal `attr.description`
  const topLevelModelA = omit(topLevelModel, 'commandDescription');
  const topLevelModelB = { ...topLevelModelA, isArray };

  return topLevelModelB;
};

const topLevelModelMatches = function ({ target, command }, topDef) {
  return topDef.model === target && topDef.command === command;
};

module.exports = {
  getNestedModel,
};
