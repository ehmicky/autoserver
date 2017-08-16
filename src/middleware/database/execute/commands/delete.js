'use strict';

const { sortArray } = require('../../../../utilities');
const { findIndexes, findIndex } = require('../find');

const deleteOne = function ({
  collection,
  filter: { id },
  opts,
  opts: { dryrun },
}) {
  const index = findIndex({ collection, id, opts });
  const model = dryrun
    ? collection[index]
    // eslint-disable-next-line fp/no-mutating-methods
    : collection.splice(index, 1)[0];
  return { data: model };
};

const deleteMany = function ({ collection, filter, opts: { dryrun } }) {
  const indexes = findIndexes({ collection, filter });
  const sortedIndexes = sortArray(indexes);
  const models = sortedIndexes.map((index, count) => {
    const model = dryrun
      ? collection[index]
      // eslint-disable-next-line fp/no-mutating-methods
      : collection.splice(index - count, 1)[0];
    return model;
  });
  return { data: models };
};

module.exports = {
  deleteOne,
  deleteMany,
};
