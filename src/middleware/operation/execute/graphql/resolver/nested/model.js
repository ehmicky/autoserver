'use strict';

const { getParentModel, parseName } = require('../utilities');

const { addNestedArg } = require('./arg');

// Resolver for nested model actions
const nestedModelResolver = function ({ name, modelsMap, parent, args }) {
  const { modelName: parentModel } = getParentModel(parent);

  // Retrieves nested attribute
  const { attrName, actionType } = parseName({ name });
  const { isArray, target: modelName } = modelsMap[parentModel][attrName];

  // Add nested if to nested actions
  // Uses the parent value as a nested filter|data
  const parentVal = parent[attrName];
  const { directReturn, args: argsA } = addNestedArg({
    parentVal,
    name,
    isArray,
    args,
    actionType,
  });

  return { isArray, modelName, actionType, directReturn, args: argsA };
};

module.exports = {
  nestedModelResolver,
};
