'use strict';

const { sortArray } = require('../../../../utilities');
const { findIndexes } = require('../find');

const deleteMany = function ({ collection, filter }) {
  const indexes = findIndexes({ collection, filter });
  const sortedIndexes = sortArray(indexes);
  const models = sortedIndexes
    // eslint-disable-next-line fp/no-mutating-methods
    .map((index, count) => collection.splice(index - count, 1)[0]);
  return { data: models };
};

module.exports = {
  delete: deleteMany,
};
