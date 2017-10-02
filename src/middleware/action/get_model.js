'use strict';

// Turn a `commandPath` into a `modelName`, using IDL information
const getModel = function ({
  commandPath,
  modelsMap,
  top: { modelName, command: { multiple } },
}) {
  const commandPathA = commandPath
    // The first element is the top-level `commandName`, not useful here
    .slice(1)
    // Ignore array indices
    .filter(key => typeof key !== 'number');

  // This means this is the top-level action
  if (commandPathA.length === 0) {
    return { modelName, multiple };
  }

  return findModel({ modelsMap, modelName, commandPath: commandPathA });
};

// Recurse over `modelsMap`, using `commandPath`
const findModel = function ({ modelsMap, modelName, commandPath }) {
  const [commandName, ...childCommandPath] = commandPath;
  const model = modelsMap[modelName][commandName];

  // Erronous `commandPath`
  if (model === undefined) { return; }

  const { target: childModelName, isArray } = model;

  if (childCommandPath.length > 0) {
    return findModel({
      modelsMap,
      modelName: childModelName,
      commandPath: childCommandPath,
    });
  }

  return { modelName: childModelName, multiple: isArray };
};

module.exports = {
  getModel,
};
