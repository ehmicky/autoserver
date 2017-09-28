'use strict';

const { pSetTimeout } = require('../../../utilities');

// Fake database for the moment
const database = require('./data.json');
const { processResponse } = require('./process_response');
const commands = require('./commands');

const databaseExecute = async function ({
  command,
  args: { orderBy, limit, offset, newData, filter, idCheck } = {},
  modelName,
  response,
}) {
  // A response was already set, e.g. by the dryrun middleware
  if (response !== undefined) { return; }

  const collection = database[modelName];
  const opts = { orderBy, limit, offset, idCheck };
  const commandInput = { command, collection, filter, newData, opts };

  // Simulate asynchronousity
  // TODO: remove when there is a real ORM
  await pSetTimeout(0);

  const { data, metadata } = commands[command](commandInput);

  const dataA = processResponse({ data, opts });

  return { response: { data: dataA, metadata } };
};

module.exports = {
  databaseExecute,
};
