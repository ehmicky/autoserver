'use strict';

// Turn a `commandpath` into a `collname`, using schema information
const getModel = function ({
  commandpath,
  collsMap,
  top: { collname, command: { multiple } },
}) {
  const commandpathA = commandpath
    // The first element is the top-level `commandName`, not useful here
    .slice(1)
    // Ignore array indices
    .filter(key => typeof key !== 'number');

  // This means this is the top-level action
  if (commandpathA.length === 0) {
    return { collname, multiple };
  }

  return findModel({ collsMap, collname, commandpath: commandpathA });
};

// Recurse over `collsMap`, using `commandpath`
const findModel = function ({ collsMap, collname, commandpath }) {
  const [commandName, ...childCommandpath] = commandpath;
  const model = collsMap[collname][commandName];

  // Erronous `commandpath`
  if (model === undefined) { return; }

  const { target: childCollname, isArray } = model;

  if (childCommandpath.length > 0) {
    return findModel({
      collsMap,
      collname: childCollname,
      commandpath: childCommandpath,
    });
  }

  return { collname: childCollname, multiple: isArray };
};

module.exports = {
  getModel,
};
