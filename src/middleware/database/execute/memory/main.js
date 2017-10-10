'use strict';

const { pSetTimeout } = require('../../../../utilities');

const database = require('./data.json');
const commands = require('./commands');
const { sortResponse } = require('./order_by');
const { offsetResponse } = require('./offset');
const { limitResponse } = require('./limit');

// Memory database adapter, i.e. keeps database in-memory
// Only used for development purpose
const memoryAdapter = async function ({
  modelName,
  command,
  filter,
  deletedIds,
  newData,
  orderBy,
  limit,
  offset,
}) {
  // Simulate asynchronousity
  await pSetTimeout(0);

  const collection = database[modelName];

  const { data, metadata } = commands[command]({
    collection,
    filter,
    deletedIds,
    newData,
  });

  const dataA = sortResponse({ data, orderBy });
  const dataB = offsetResponse({ data: dataA, offset });
  const dataC = limitResponse({ data: dataB, limit });

  return { data: dataC, metadata };
};

module.exports = {
  memoryAdapter,
};
