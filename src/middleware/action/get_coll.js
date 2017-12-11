'use strict';

// Turn a `commandpath` into a `collname`, using schema information
const getColl = function ({
  commandpath,
  schema,
  top: { collname, command: { multiple } },
}) {
  // Ignore array indices
  const commandpathA = commandpath.filter(key => typeof key !== 'number');

  // This means this is the top-level action
  if (commandpathA.length === 0) {
    return { collname, multiple };
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
  const attr = collections[collname].attributes[attrName];

  // Erronous `commandpath`
  if (attr === undefined) { return; }

  const { target: childCollname, isArray } = attr;

  if (childCommandpath.length !== 0) {
    return findColl({
      schema,
      collname: childCollname,
      commandpath: childCommandpath,
    });
  }

  return { collname: childCollname, multiple: isArray };
};

module.exports = {
  getColl,
};
