'use strict';

const { findIndexes } = require('../find');

const read = function ({ collection, filter, opts: { idCheck } }) {
  const indexes = findIndexes({ collection, filter, idCheck });
  const models = indexes.map(index => collection[index]);
  return { data: models };
};

module.exports = {
  read,
};
