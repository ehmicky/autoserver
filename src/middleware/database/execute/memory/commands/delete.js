'use strict';

const { sortArray } = require('../../../../../utilities');

const deleteMany = function ({ collection, deletedIds }) {
  const indexes = Object.entries(collection)
    .filter(([, model]) => deletedIds.includes(model.id))
    .map(([index]) => index);
  const sortedIndexes = sortArray(indexes);
  const data = sortedIndexes
    // eslint-disable-next-line fp/no-mutating-methods
    .map((index, count) => collection.splice(index - count, 1)[0]);
  return { data };
};

module.exports = {
  delete: deleteMany,
};
