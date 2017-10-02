'use strict';

const { findIndexes } = require('../indexes');

const find = function ({ collection, filter }) {
  const indexes = findIndexes({ collection, filter });
  const data = indexes.map(index => collection[index]);
  return { data };
};

module.exports = {
  find,
};
