'use strict';

const { validateMissingIds } = require('./missing_id');
const { modelMatchFilter } = require('./operators');

const find = function ({ collection, filter }) {
  validateMissingIds({ collection, filter });

  const data = collection.filter(model => modelMatchFilter({ model, filter }));
  return { data };
};

module.exports = {
  find,
};
