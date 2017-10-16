'use strict';

const { pSetTimeout } = require('../../../../utilities');

const { sortResponse } = require('./order_by');
const { offsetResponse } = require('./offset');
const { limitResponse } = require('./limit');

// Add sorting, offsetting, limiting, and async emulation to each method
const wrapCommand = async function (
  func,
  {
    modelName,
    filter,
    deletedIds,
    newData,
    orderBy,
    limit,
    offset,
    connection,
  },
) {
  // Simulate asynchronousity
  await pSetTimeout(0);

  const collection = connection[modelName];

  const data = func({ collection, filter, deletedIds, newData });

  const dataA = sortResponse({ data, orderBy });
  const dataB = offsetResponse({ data: dataA, offset });
  const dataC = limitResponse({ data: dataB, limit });

  return dataC;
};

module.exports = {
  wrapCommand,
};
