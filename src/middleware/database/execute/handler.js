'use strict';


// Fake database for the moment
const database = require('./data.json');
const { fireCommand } = require('./commands');


const databaseExecute = function () {
  return async function databaseExecute(input) {
    const { command, args = {}, modelName, jsl, log } = input;
    const perf = log.perf.start('database.execute', 'middleware');

    const {
      order_by: orderBy,
      limit,
      offset,
      dry_run: dryRun,
      newData,
      filter,
    } = args;
    const collection = database[modelName];

    const opts = { jsl, orderBy, limit, offset, dryRun, modelName };
    const commandInput = { command, collection, filter, newData, opts };
    const response = fireCommand(commandInput);

    perf.stop();
    return response;
  };
};


module.exports = {
  databaseExecute,
};
