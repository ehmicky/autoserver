'use strict';

const { extractSimpleIds } = require('../../filter');

// Delegates to database adapter
const databaseExecute = async function ({
  dbAdapter,
  modelname,
  args,
  args: { dryrun },
  command,
}) {
  // Make write commands not change data, if argument `dryrun` is used
  if (dryrun && command !== 'find') { return; }

  const commandInput = getCommandInput({ command, modelname, args });

  const dbData = await dbAdapter.query(commandInput);
  return { dbData };
};

// Database adapter input
const getCommandInput = function ({
  command,
  modelname,
  args: { filter = {}, order, limit, offset, newData, deletedIds },
}) {
  const filterIds = extractSimpleIds({ filter });

  const commandA = commandMap[command];

  return {
    command: commandA,
    filter,
    filterIds,
    modelname,
    deletedIds,
    newData,
    order,
    limit,
    offset,
  };
};

// From API command to database adapter's command
// `patch` behaves like a `find` followed by a `upsert`.
// `create` does an upsert to minimize concurrency conflicts,
// i.e. if the model was created or deleted since the `currentData` query was
// performed
const commandMap = {
  find: 'find',
  delete: 'delete',
  patch: 'upsert',
  upsert: 'upsert',
  create: 'upsert',
};

module.exports = {
  databaseExecute,
};
