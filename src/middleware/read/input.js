'use strict';

const { getCommand } = require('../../constants');

const { getParentResults, getParentIds } = require('./parent');

// Retrieve the main information we need to perform the commands
const getInput = function ({
  action: {
    commandPath,
    command: { type: commandType },
  },
  results,
}) {
  const isTopLevel = commandPath.length === 1;
  // All `find` commands are normalized to `findMany`
  const command = getCommand({ commandType, multiple: true });

  const parentResults = getParentResults({ commandPath, results });
  const commandName = commandPath[commandPath.length - 1];
  const { nestedParentIds, parentIds } = getParentIds({
    commandName,
    parentResults,
  });

  return {
    isTopLevel,
    command,
    parentResults,
    commandName,
    nestedParentIds,
    parentIds,
  };
};

module.exports = {
  getInput,
};
