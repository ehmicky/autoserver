'use strict';


// Fake database for the moment
const database = require('./data.json');
const { fireCommand } = require('./commands');


const executeDatabaseAction = async function () {
  return async function executeDatabaseAction(input) {
    const {
      command,
      args = {},
      modelName,
      info,
      params,
    } = input;
    const {
      order_by: orderBy,
      limit,
      offset,
      dry_run: dryRun,
      no_output: noOutput,
      data,
      filter,
    } = args;
    const { ip, timestamp, helpers, variables } = info;
    const requestInput = { ip, timestamp, params };
    const interfaceInput = { command };
    const jslInput = { helpers, variables, requestInput, interfaceInput };
    const collection = database[modelName];

    const opts = {
      jslInput,
      orderBy,
      limit,
      offset,
      dryRun,
      noOutput,
      modelName,
    };
    const commandInput = { command, collection, filter, data, opts };
    const response = fireCommand(commandInput);
    return response;
  };
};


module.exports = {
  executeDatabaseAction,
};
