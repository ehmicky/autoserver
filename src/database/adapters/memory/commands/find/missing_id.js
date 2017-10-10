'use strict';

const { throwError } = require('../../../../../error');
const { crawlFilter } = require('../../../../crawl');

// Simulate database 404 errors
const validateMissingIds = function ({ collection, filter }) {
  const ids = crawlFilter(filter, getId);
  ids.forEach(id => validateId({ collection, id }));
};

// Retrieve all the `id` specifically targetted in `args.filter`,
// i.e. the ones with 'eq' and 'in' operators.
const getId = function ({ type, attrName, value }) {
  if (!['eq', 'in'].includes(type) || attrName !== 'id') { return []; }

  return Array.isArray(value) ? value : [value];
};

const validateId = function ({ collection, id }) {
  const hasModel = collection.some(model => model.id === id);
  if (hasModel) { return; }

  const message = `Could not find any model with an 'id' equal to '${id}'`;
  throwError(message, { reason: 'DATABASE_NOT_FOUND' });
};

module.exports = {
  validateMissingIds,
};
