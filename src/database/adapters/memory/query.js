'use strict';

const { pSetTimeout } = require('../../../utilities');

const { find } = require('./find');
const { create } = require('./create');
const { delete: deleteMany } = require('./delete');
const { replace } = require('./replace');

// CRUD commands
const query = async function ({
  modelName,
  command,
  filter,
  deletedIds,
  newData,
  orderBy,
  limit,
  offset,
  connection,
}) {
  // Simulate asynchronousity
  await pSetTimeout(0);

  const collection = connection[modelName];

  return commands[command]({
    collection,
    filter,
    deletedIds,
    newData,
    orderBy,
    limit,
    offset,
  });
};

const commands = {
  find,
  create,
  delete: deleteMany,
  replace,
};

module.exports = {
  query,
};
