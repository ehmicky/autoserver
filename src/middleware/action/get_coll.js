'use strict';

// Turn a `commandpath` into a `collname`, using schema information
const getColl = function ({
  commandpath,
  collsMap,
  top: { collname, clientCollname, command: { multiple } },
}) {
  const commandpathA = commandpath
    // The first element is the top-level `commandName`, not useful here
    .slice(1)
    // Ignore array indices
    .filter(key => typeof key !== 'number');

  // This means this is the top-level action
  if (commandpathA.length === 0) {
    return { collname, clientCollname, multiple };
  }

  return findColl({ collsMap, collname, commandpath: commandpathA });
};

// Recurse over `collsMap`, using `commandpath`
const findColl = function ({ collsMap, collname, commandpath }) {
  const [attrName, ...childCommandpath] = commandpath;
  const collnameA = collsMap[collname][attrName];

  // Erronous `commandpath`
  if (collnameA === undefined) { return; }

  const { target: childCollname, clientTarget, isArray } = collnameA;

  if (childCommandpath.length !== 0) {
    return findColl({
      collsMap,
      collname: childCollname,
      commandpath: childCommandpath,
    });
  }

  return {
    collname: childCollname,
    clientCollname: clientTarget,
    multiple: isArray,
  };
};

module.exports = {
  getColl,
};
