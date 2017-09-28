'use strict';

const { inMemoryAdapter } = require('./in_memory');

const databaseExecute = async function ({
  command,
  args: { orderBy, limit, offset, newData, filter, idCheck } = {},
  modelName,
  response,
}) {
  // A response was already set, e.g. by the dryrun middleware
  if (response !== undefined) { return; }

  const commandInput = {
    modelName,
    command,
    filter,
    newData,
    idCheck,
    orderBy,
    limit,
    offset,
  };
  const responseA = await inMemoryAdapter(commandInput);

  return { response: responseA };
};

module.exports = {
  databaseExecute,
};
