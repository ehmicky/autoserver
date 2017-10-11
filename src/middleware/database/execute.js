'use strict';

// Fire actual database query
const databaseExecute = async function ({
  command,
  args: { orderBy, limit, offset, newData, filter, deletedIds } = {},
  modelName,
  response,
  dbAdapters,
}) {
  // A response was already set, e.g. by the dryrun middleware
  if (response !== undefined) { return; }

  // `patch` command behaves like `replace`, so we simplify adapters here
  const commandA = command === 'patch' ? 'replace' : command;

  const commandInput = {
    modelName,
    filter,
    deletedIds,
    newData,
    orderBy,
    limit,
    offset,
  };

  const responseA = await dbAdapters[modelName][commandA](commandInput);

  return { response: responseA };
};

module.exports = {
  databaseExecute,
};
