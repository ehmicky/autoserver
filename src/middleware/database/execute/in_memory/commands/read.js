'use strict';

const { findIndexes } = require('../indexes');

const read = function ({ collection, filter, idCheck }) {
  const indexes = findIndexes({ collection, filter, idCheck });
  const data = indexes.map(index => collection[index]);
  return { data };
};

module.exports = {
  read,
};
