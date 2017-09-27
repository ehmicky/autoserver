'use strict';

// Fake database for the moment
const database = require('./data.json');
const { fireCommand } = require('./fire');

const databaseExecute = function ({
  command,
  args: { orderBy, limit, offset, newData, filter, idCheck } = {},
  modelName,
  response,
}) {
  // A response was already set, e.g. by the dryrun middleware
  if (response !== undefined) { return; }

  const collection = database[modelName];

  const opts = { orderBy, limit, offset, idCheck };
  const commandInput = { command, collection, filter, newData, opts };
  console.log(command, modelName, (filter && filter.id), (newData && newData.map(({ id }) => id)), orderBy);

  return fireCommand(commandInput);
};

module.exports = {
  databaseExecute,
};
