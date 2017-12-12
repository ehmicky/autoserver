'use strict';

// Turn a `commandpath` into a `collname`, using config
const getColl = function ({
  commandpath,
  config,
  top: { collname, command: { multiple } },
}) {
  // Ignore array indices
  const commandpathA = commandpath.filter(key => typeof key !== 'number');

  // This means this is the top-level action
  if (commandpathA.length === 0) {
    return { collname, multiple };
  }

  return findColl({ config, collname, commandpath: commandpathA });
};

// Recurse over `config.collections`, using `commandpath`
const findColl = function ({
  config,
  config: { collections },
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
      config,
      collname: childCollname,
      commandpath: childCommandpath,
    });
  }

  return { collname: childCollname, multiple: isArray };
};

module.exports = {
  getColl,
};
