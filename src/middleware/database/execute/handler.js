'use strict';

// Fake database for the moment
const database = require('./data.json');
const { fireCommand } = require('./fire');

const databaseExecute = function ({
  command,
  args: { orderBy, limit, offset, newData, filter } = {},
  settings: { dryrun },
  modelName,
}) {
  const collection = database[modelName];

  const opts = { orderBy, limit, offset, dryrun, modelName };
  const commandInput = { command, collection, filter, newData, opts };
  return fireCommand(commandInput);
};

module.exports = {
  databaseExecute,
};
