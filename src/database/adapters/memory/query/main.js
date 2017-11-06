'use strict';

const { pSetTimeout } = require('../../../../utilities');

const { find } = require('./find');
const { delete: deleteMany } = require('./delete');
const { upsert } = require('./upsert');

// CRUD commands
const query = async function ({
  modelname,
  command,
  filter,
  deletedIds,
  newData,
  orderby,
  limit,
  offset,
  connection,
}) {
  // Simulate asynchronousity
  await pSetTimeout(0);

  const collection = connection[modelname];

  return commands[command]({
    collection,
    filter,
    deletedIds,
    newData,
    orderby,
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
