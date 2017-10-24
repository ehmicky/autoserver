'use strict';

const { uniq } = require('lodash');

const { assignArray } = require('../utilities');

// Try to guess the model `id`s by looking at `args.filter`
// This won't work on top-level filter of findMany command using a complex one,
// but that's ok because it will not have any concurrent commands.
const extractSimpleIds = function ({ filter: { type, attrName, value } = {} }) {
  if (type === 'and') {
    return parseAuthorizationFilter({ value });
  }

  if (isComplex({ type, attrName })) { return; }

  // Use either type 'eq' or 'in'
  const ids = type === 'in' ? value : [value];

  const idsA = uniq(ids);

  return idsA;
};

// When an authorization filter was used, it adds an 'and' top-level node
const parseAuthorizationFilter = function ({ value }) {
  return value
    .map(node => extractSimpleIds({ filter: node }))
    .reduce(assignArray, []);
};

// Check if `args.filter` is too complex to guess model `id`s
// Also if there is no filter
const isComplex = function ({ type, attrName }) {
  return !(attrName === 'id' && ['eq', 'in'].includes(type));
};

// Returns simple `args.filter` that only filters by `model.id`
const getSimpleFilter = function ({ ids }) {
  return ids.length === 1
    ? { attrName: 'id', type: 'eq', value: ids[0] }
    : { attrName: 'id', type: 'in', value: uniq(ids) };
};

module.exports = {
  extractSimpleIds,
  getSimpleFilter,
};
