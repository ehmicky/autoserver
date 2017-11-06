'use strict';

const { getQueryFilter } = require('./operators');
const { limitResponse } = require('./limit');
const { offsetResponse } = require('./offset');
const { sortResponse } = require('./orderby');

// Find models
const find = function (input) {
  const { filterIds } = input;
  const method = filterIds && filterIds.length === 1 ? findOne : findMany;
  return method(input);
};

const findOne = async function ({ collection, filterIds }) {
  const model = await collection.findOne({ _id: filterIds[0] });
  return model == null ? [] : [model];
};

const findMany = function ({
  collection,
  filter,
  offset,
  limit,
  orderby,
}) {
  const queryFilter = getQueryFilter(filter);
  const cursor = collection.find(queryFilter);

  const cursorA = limitResponse({ cursor, limit });
  const cursorB = offsetResponse({ cursor: cursorA, offset });
  const cursorC = sortResponse({ cursor: cursorB, orderby });

  return cursorC.toArray();
};

module.exports = {
  find,
};
