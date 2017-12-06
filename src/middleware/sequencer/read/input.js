'use strict';

const { getParentResults, getParentIds } = require('./parent_results');
const { validateMaxmodels } = require('./limits');

// Retrieve the main information we need to perform the commands
const getInput = function ({
  action: { commandpath },
  results,
  maxmodels,
  top,
}) {
  const isTopLevel = commandpath.length === 0;

  const parentResults = getParentResults({ commandpath, results });
  const commandName = commandpath[commandpath.length - 1];
  const { nestedParentIds, parentIds, allIds } = getParentIds({
    commandName,
    parentResults,
  });

  validateMaxmodels({ results, allIds, maxmodels, top });

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
