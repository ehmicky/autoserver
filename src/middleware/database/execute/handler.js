'use strict';

// Fake database for the moment
const database = require('./data.json');
const { fireCommand } = require('./fire');

const databaseExecute = async function ({
  command,
  args: { nOrderBy, limit, offset, newData, filter } = {},
  settings: { dryrun },
  modelName,
}) {
  const collection = database[modelName];

  const opts = { nOrderBy, limit, offset, dryrun, modelName };
  const commandInput = { command, collection, filter, newData, opts };
  const response = await fireCommand(commandInput);

  return { response };
};

module.exports = {
  databaseExecute,
};
