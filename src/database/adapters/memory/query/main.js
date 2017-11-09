'use strict';

const { pSetTimeout } = require('../../../../utilities');

const { find } = require('./find');
const { delete: deleteMany } = require('./delete');
const { upsert } = require('./upsert');

// CRUD commands
const query = async function ({
  collname,
  command,
  filter,
  deletedIds,
  newData,
  order,
  limit,
  offset,
  connection,
}) {
  // Simulate asynchronousity
  await pSetTimeout(0);

  const collection = connection[collname];

  return commands[command]({
    collection,
    filter,
    deletedIds,
    newData,
    order,
    limit,
    offset,
  });
};

const commands = {
  find,
  delete: deleteMany,
  upsert,
};

module.exports = {
  query,
};
