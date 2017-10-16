'use strict';

const { extractSimpleIds } = require('../../../database');

// Returns database adapter's input
const getCommandInput = function ({
  command,
  args: {
    orderBy,
    limit,
    offset,
    newData,
    filter,
    deletedIds,
  },
  dryrun: { newInput = {} },
  modelName,
}) {
  const commandA = getCommand({ command, newInput });
  const filterA = newInput.filter || filter || {};
  const filterIds = extractSimpleIds({ filter: filterA });

  const commandInput = {
    command: commandA,
    modelName,
    filter: filterA,
    filterIds,
    deletedIds,
    newData,
    orderBy,
    limit,
    offset,
  };

  return { command: commandA, commandInput };
};

const getCommand = function ({ command, newInput }) {
  // Fake input during dry runs
  if (newInput.command) { return newInput.command; }

  // `patch` command behaves like `replace`, so we simplify adapters here
  if (command === 'patch') { return 'replace'; }

  return command;
};

module.exports = {
  getCommandInput,
};
