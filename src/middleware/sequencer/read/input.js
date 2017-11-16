'use strict';

const { getParentResults, getParentIds } = require('./parent_results');

// Retrieve the main information we need to perform the commands
const getInput = function ({
  action: { commandpath },
  results,
}) {
  const isTopLevel = commandpath.length === 1;

  const parentResults = getParentResults({ commandpath, results });
  const commandName = commandpath[commandpath.length - 1];
  const { nestedParentIds, parentIds } = getParentIds({
    commandName,
    parentResults,
  });

  return {
    isTopLevel,
    parentResults,
    commandName,
    nestedParentIds,
    parentIds,
  };
};

module.exports = {
  getInput,
};
