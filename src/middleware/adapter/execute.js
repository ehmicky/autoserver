'use strict';

const { extractSimpleIds } = require('../../filter');

// Delegates to database adapter
const databaseExecute = async function ({
  dbAdapter,
  modelName,
  args,
  args: { dryrun },
  command,
}) {
  // Make write commands not change data, if argument `dryrun` is used
  if (dryrun && command !== 'find') { return; }

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
