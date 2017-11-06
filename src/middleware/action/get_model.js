'use strict';

// Turn a `commandpath` into a `modelname`, using schema information
const getModel = function ({
  commandpath,
  modelsMap,
  top: { modelname, command: { multiple } },
}) {
  const commandpathA = commandpath
    // The first element is the top-level `commandName`, not useful here
    .slice(1)
    // Ignore array indices
    .filter(key => typeof key !== 'number');

  // This means this is the top-level action
  if (commandpathA.length === 0) {
    return { modelname, multiple };
  }

  return findModel({ modelsMap, modelname, commandpath: commandpathA });
};

// Recurse over `modelsMap`, using `commandpath`
const findModel = function ({ modelsMap, modelname, commandpath }) {
  const [commandName, ...childCommandpath] = commandpath;
  const model = modelsMap[modelname][commandName];

  // Erronous `commandpath`
  if (model === undefined) { return; }

  const { target: childModelname, isArray } = model;

  if (childCommandpath.length > 0) {
    return findModel({
      modelsMap,
      modelname: childModelname,
      commandpath: childCommandpath,
    });
  }

  return { modelname: childModelname, multiple: isArray };
};

module.exports = {
  getModel,
};
