'use strict';

const { extractSimpleIds } = require('../../database');

// Delegates to database adapter
const databaseExecute = async function ({
  dbAdapter,
  modelName,
  args,
  command,
  noQuery,
}) {
  // `dryrun` middleware with create|replace|patch
  if (noQuery) { return; }

  const commandInput = getCommandInput({ command, modelName, args });

  const dbData = await dbAdapter.query(commandInput);
  return { dbData };
};

// Database adapter input
const getCommandInput = function ({
  command,
  modelName,
  args: { filter = {}, orderBy, limit, offset, newData, deletedIds },
}) {
  const filterIds = extractSimpleIds({ filter });

  // `patch` command behaves like `replace`, so we simplify adapters here
  const commandA = command === 'patch' ? 'replace' : command;

  return {
    command: commandA,
    filter,
    filterIds,
    modelName,
    deletedIds,
    newData,
    orderBy,
    limit,
    offset,
  };
};

module.exports = {
  databaseExecute,
};
