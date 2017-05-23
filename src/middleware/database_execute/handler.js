'use strict';


// Fake database for the moment
const database = require('./data.json');
const { fireCommand } = require('./commands');


const databaseExecute = function () {
  return async function executeDatabaseAction(input) {
    const { command, args = {}, modelName, jsl } = input;
    const {
      order_by: orderBy,
      limit,
      offset,
      dry_run: dryRun,
      no_output: noOutput,
      data,
      filter,
    } = args;
    const collection = database[modelName];

    const opts = { jsl, orderBy, limit, offset, dryRun, noOutput, modelName };
    const commandInput = { command, collection, filter, data, opts };
    const response = fireCommand(commandInput);
    return response;
  };
};


module.exports = {
  databaseExecute,
};
