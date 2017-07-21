'use strict';

const { findIndexes, findIndexByFilter } = require('../find');

const readOne = function ({ collection, nFilter, opts }) {
  const index = findIndexByFilter({ collection, nFilter, opts });
  return { data: collection[index] };
};

const readMany = function ({ collection, nFilter, opts }) {
  const indexes = findIndexes({ collection, nFilter, opts });
  const models = indexes.map(index => collection[index]);
  return { data: models };
};

module.exports = {
  readOne,
  readMany,
};
