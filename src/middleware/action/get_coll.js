'use strict';

// Turn a `commandpath` into a `collname`, using schema information
const getColl = function ({
  commandpath,
  schema,
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

  return findColl({ schema, collname, commandpath: commandpathA });
};

// Recurse over `schema.collections`, using `commandpath`
const findColl = function ({
  schema,
  schema: { collections },
  collname,
  commandpath,
}) {
  const [attrName, ...childCommandpath] = commandpath;
  const coll = collections[collname].attributes[attrName];

  // Erronous `commandpath`
  if (coll === undefined) { return; }

  const { target: childCollname, isArray } = coll;

  if (childCommandpath.length !== 0) {
    return findColl({
      schema,
      collname: childCollname,
      commandpath: childCommandpath,
    });
  }

  const { name: [clientCollname] = [] } = collections[childCollname] || {};

  return {
    collname: childCollname,
    clientCollname,
    multiple: isArray,
  };
};

module.exports = {
  getColl,
};
