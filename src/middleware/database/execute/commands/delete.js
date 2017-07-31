'use strict';

const { sortArray } = require('../../../../utilities');
const { findIndexes, findIndexByFilter } = require('../find');

const deleteOne = function ({ collection, nFilter, opts, opts: { dryRun } }) {
  const index = findIndexByFilter({ collection, nFilter, opts });
  const model = dryRun
    ? collection[index]
    // eslint-disable-next-line fp/no-mutating-methods
    : collection.splice(index, 1)[0];
  return { data: model };
};

const deleteMany = function ({ collection, nFilter, opts, opts: { dryRun } }) {
  const indexes = findIndexes({ collection, nFilter, opts });
  const sortedIndexes = sortArray(indexes);
  const models = sortedIndexes.map((index, count) => {
    const model = dryRun
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
