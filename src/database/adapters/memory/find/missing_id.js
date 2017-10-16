'use strict';

const { assignArray } = require('../../../../utilities');
const { throwError } = require('../../../../error');
const { crawlFilter } = require('../../../crawl');

// Simulate database 404 errors
const validateMissingIds = function ({ collection, filter }) {
  const ids = crawlFilter(filter, getId)
    .reduce(assignArray, []);
  ids.forEach(id => validateId({ collection, id }));
};

// Retrieve all the `id` specifically targetted in `args.filter`,
// i.e. the ones with 'eq' and 'in' operators.
const getId = function ({ type, attrName, value }) {
  const isDirectId = ['eq', 'in'].includes(type) && attrName === 'id';
  if (isDirectId) { return value; }
};

const validateId = function ({ collection, id }) {
  const hasModel = collection.some(model => model.id === id);
  if (hasModel) { return; }

  const message = `Could not find any model with an 'id' equal to '${id}'`;
  throwError(message, { reason: 'DB_MODEL_NOT_FOUND' });
};

module.exports = {
  validateMissingIds,
};
