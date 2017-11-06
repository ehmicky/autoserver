'use strict';

// Turn a `commandpath` into a `modelName`, using schema information
const getModel = function ({
  commandpath,
  modelsMap,
  top: { modelName, command: { multiple } },
}) {
  const commandpathA = commandpath
    // The first element is the top-level `commandName`, not useful here
    .slice(1)
    // Ignore array indices
    .filter(key => typeof key !== 'number');

  // This means this is the top-level action
  if (commandpathA.length === 0) {
    return { modelName, multiple };
  }

  return findModel({ modelsMap, modelName, commandpath: commandpathA });
};

// Recurse over `modelsMap`, using `commandpath`
const findModel = function ({ modelsMap, modelName, commandpath }) {
  const [commandName, ...childCommandpath] = commandpath;
  const model = modelsMap[modelName][commandName];

  // Erronous `commandpath`
  if (model === undefined) { return; }

  const { target: childModelName, isArray } = model;

  if (childCommandpath.length > 0) {
    return findModel({
      modelsMap,
      modelName: childModelName,
      commandpath: childCommandpath,
    });
  }

  return { modelName: childModelName, multiple: isArray };
};

module.exports = {
  getModel,
};
