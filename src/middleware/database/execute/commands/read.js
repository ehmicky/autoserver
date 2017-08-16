'use strict';

const { findIndexes, findIndex } = require('../find');

const readOne = function ({ collection, filter: { id }, opts }) {
  const index = findIndex({ collection, id, opts });
  return { data: collection[index] };
};

const readMany = function ({ collection, filter }) {
  const indexes = findIndexes({ collection, filter });
  const models = indexes.map(index => collection[index]);
  return { data: models };
};

module.exports = {
  readOne,
  readMany,
};
