'use strict';


// Fake database for the moment
const database = require('./data.json');
const { fireCommand } = require('./commands');


const databaseExecute = function () {
  return async function databaseExecute(input) {
    const { command, dbArgs = {}, modelName, jsl, log } = input;
    const perf = log.perf.start('database.execute', 'middleware');

    const {
      order_by: orderBy,
      limit,
      offset,
      dry_run: dryRun,
      data,
      filter,
    } = dbArgs;
    const collection = database[modelName];

    const opts = { jsl, orderBy, limit, offset, dryRun, modelName };
    const commandInput = { command, collection, filter, data, opts };
    const response = fireCommand(commandInput);

    perf.stop();
    return response;
  };
};


module.exports = {
  databaseExecute,
};
