'use strict';

const { sortArray } = require('../../../../utilities');
const { findIndexes, findIndex } = require('../find');

const deleteOne = function ({ collection, filter: { id }, opts }) {
  const index = findIndex({ collection, id, opts });
  // eslint-disable-next-line fp/no-mutating-methods
  const [model] = collection.splice(index, 1);
  return { data: model };
};

const deleteMany = function ({ collection, filter }) {
  const indexes = findIndexes({ collection, filter });
  const sortedIndexes = sortArray(indexes);
  const models = sortedIndexes.map((index, count) =>
    // eslint-disable-next-line fp/no-mutating-methods
    collection.splice(index - count, 1)[0]
  );
  return { data: models };
};

module.exports = {
  deleteOne,
  deleteMany,
};
