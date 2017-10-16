'use strict';

const { wrapCommand } = require('../wrap');

const { validateMissingIds } = require('./missing_id');
const { modelMatchFilter } = require('./operators');

const find = function ({ collection, filter }) {
  validateMissingIds({ collection, filter });

  const data = collection.filter(model => modelMatchFilter({ model, filter }));
  return { data };
};

const wFind = wrapCommand.bind(null, find);

module.exports = {
  find: wFind,
};
