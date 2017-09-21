'use strict';

const { findIndexes } = require('../find');

const read = function ({ collection, filter }) {
  const indexes = findIndexes({ collection, filter });
  const models = indexes.map(index => collection[index]);
  return { data: models };
};

module.exports = {
  read,
};
