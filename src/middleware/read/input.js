'use strict';

const { getParentResults, getParentIds } = require('./parent_results');

// Retrieve the main information we need to perform the commands
const getInput = function ({
  action: { commandPath },
  results,
}) {
  const isTopLevel = commandPath.length === 1;

  const parentResults = getParentResults({ commandPath, results });
  const commandName = commandPath[commandPath.length - 1];
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
