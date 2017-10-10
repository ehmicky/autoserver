'use strict';

const { pSetTimeout, mapValues } = require('../../../utilities');

const database = require('./data.json');
const commands = require('./commands');
const { sortResponse } = require('./order_by');
const { offsetResponse } = require('./offset');
const { limitResponse } = require('./limit');

// Memory database adapter, i.e. keeps database in-memory
// Only used for development purpose
const wrapCommand = async function (func, {
  modelName,
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

  const { data, metadata } = func({ collection, filter, deletedIds, newData });

  const dataA = sortResponse({ data, orderBy });
  const dataB = offsetResponse({ data: dataA, offset });
  const dataC = limitResponse({ data: dataB, limit });

  return { data: dataC, metadata };
};

const commandsA = mapValues(commands, func => wrapCommand.bind(null, func));

module.exports = {
  type: 'memory',
  ...commandsA,
};
