'use strict';

const getModel = function ({
  modelsMap,
  top: { modelName, command: { multiple } },
  commandPath,
}) {
  const commandPathA = commandPath
    .slice(1)
    .filter(key => typeof key !== 'number');

  if (commandPathA.length === 0) {
    return { modelName, isArray: multiple };
  }

  return findModel({ modelsMap, modelName, commandPath: commandPathA });
};

const findModel = function ({ modelsMap, modelName, commandPath }) {
  const [commandName, ...childCommandPath] = commandPath;

  if (!modelsMap[modelName][commandName]) { return; }

  const { target: childModelName, isArray } = modelsMap[modelName][commandName];

  if (childCommandPath.length > 0) {
    return findModel({
      modelsMap,
      modelName: childModelName,
      commandPath: childCommandPath,
    });
  }

  return { modelName: childModelName, isArray };
};

module.exports = {
  getModel,
};
