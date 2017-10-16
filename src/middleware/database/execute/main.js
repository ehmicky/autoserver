'use strict';

const { getCommandInput } = require('./input');
const { queryDatabase } = require('./query');
const { getResponse } = require('./response');

// Fire actual database query
const databaseExecute = async function ({
  command,
  args,
  dryrun = {},
  modelName,
  dbAdapters,
}) {
  const { command: commandA, commandInput } = getCommandInput({
    command,
    args,
    dryrun,
    modelName,
  });

  const dbData = await queryDatabase({
    dbAdapters,
    modelName,
    command: commandA,
    commandInput,
    dryrun,
  });

  const response = getResponse({ dbData, args, command: commandA });
  return { response };
};

module.exports = {
  databaseExecute,
};
