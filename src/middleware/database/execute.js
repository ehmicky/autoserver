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
  //console.log(modelName, command);
  if (modelName === 'owner' && command === 'patch') {
    throw 'oops';
  }

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

  const commandA = commandMap[command];

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

// From API command to database adapter's command
// `patch` behaves like a `find` followed by a `replace`.
// `create` and `replace` do an upsert to minimize concurrency conflicts,
// i.e. if the model was created or deleted since the `currentData` query was
// performed
const commandMap = {
  find: 'find',
  delete: 'delete',
  patch: 'upsert',
  replace: 'upsert',
  create: 'upsert',
};

module.exports = {
  databaseExecute,
};
