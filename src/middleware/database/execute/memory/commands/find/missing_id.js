'use strict';

const { assignArray } = require('../../../../../../utilities');
const { throwError } = require('../../../../../../error');

// Simulate database 404 errors
const validateMissingIds = function ({ collection, filter }) {
  const ids = getIds(filter);
  ids.forEach(id => validateId({ collection, id }));
};

// Retrieve all the `id` specifically targetted in `args.filter`,
// i.e. the ones with 'eq' and 'in' operators.
const getIds = function ({ type, attrName, value }) {
  const crawler = crawlers[type];
  if (crawler === undefined) { return []; }

  return crawler({ attrName, value });
};

const getId = function ({ attrName, value }) {
  if (attrName !== 'id') { return []; }

  return Array.isArray(value) ? value : [value];
};

const crawlIds = function ({ value }) {
  return value
    .map(getIds)
    .reduce(assignArray, []);
};

const crawlers = {
  eq: getId,
  in: getId,
  all: crawlIds,
  some: crawlIds,
  or: crawlIds,
  and: crawlIds,
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
