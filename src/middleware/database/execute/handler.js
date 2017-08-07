'use strict';

// Fake database for the moment
const database = require('./data.json');
const { fireCommand } = require('./fire');

const databaseExecute = function (nextFunc, input) {
  const { command, args = {}, settings, modelName, jsl, idl } = input;

  const { nOrderBy, limit, offset, newData, nFilter } = args;
  const { dryrun } = settings;
  const collection = database[modelName];

  const opts = { jsl, idl, nOrderBy, limit, offset, dryrun, modelName };
  const commandInput = { command, collection, nFilter, newData, opts };
  const response = fireCommand(commandInput);

  return response;
};

module.exports = {
  databaseExecute,
};
