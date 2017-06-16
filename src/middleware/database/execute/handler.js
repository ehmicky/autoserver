'use strict';


// Fake database for the moment
const database = require('./data.json');
const { fireCommand } = require('./commands');


const databaseExecute = async function (input) {
  const { command, args = {}, settings, modelName, jsl, log } = input;
  const perf = log.perf.start('database.execute', 'middleware');

  const { nOrderBy, limit, offset, newData, nFilter } = args;
  const { dryRun } = settings;
  const collection = database[modelName];

  const opts = { jsl, nOrderBy, limit, offset, dryRun, modelName };
  const commandInput = { command, collection, nFilter, newData, opts };
  const response = fireCommand(commandInput);

  perf.stop();
  return response;
};


module.exports = {
  databaseExecute,
};
