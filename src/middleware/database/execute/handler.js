'use strict';

// Fake database for the moment
const database = require('./data.json');
const { fireCommand } = require('./fire');

const databaseExecute = async function (input) {
  const { command, args = {}, settings, modelName } = input;

  const { nOrderBy, limit, offset, newData, filter } = args;
  const { dryrun } = settings;
  const collection = database[modelName];

  const opts = { nOrderBy, limit, offset, dryrun, modelName };
  const commandInput = { command, collection, filter, newData, opts };
  const response = await fireCommand(commandInput);

  return { ...input, response };
};

module.exports = {
  databaseExecute,
};
