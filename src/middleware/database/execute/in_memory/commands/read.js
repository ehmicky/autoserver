'use strict';

const { findIndexes } = require('../indexes');

const read = function ({ collection, filter, idCheck }) {
  const indexes = findIndexes({ collection, filter, idCheck });
  const models = indexes.map(index => collection[index]);
  return { data: models };
};

module.exports = {
  read,
};
