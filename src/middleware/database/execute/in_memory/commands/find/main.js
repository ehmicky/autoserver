'use strict';

const { modelMatchFilter } = require('./operators');

const find = function ({ collection, filter }) {
  const data = collection
    .filter(model => modelMatchFilter({ model, collection, filter }));
  return { data };
};

module.exports = {
  find,
};
