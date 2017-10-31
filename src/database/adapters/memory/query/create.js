'use strict';

// Create models
const create = function ({ collection, newData }) {
  // eslint-disable-next-line fp/no-mutating-methods
  collection.push(...newData);
};

module.exports = {
  create,
};
