'use strict';

const { uniq } = require('lodash');

// Returns simple `args.filter` that only filters by `model.id`
const getSimpleFilter = function ({ ids }) {
  return ids.length === 1
    ? { attrName: 'id', type: 'eq', value: ids[0] }
    : { attrName: 'id', type: 'in', value: uniq(ids) };
};

// Try to guess the model `id`s by looking at `args.filter`
// This won't work on top-level filter of findMany command using a complex one,
// but that's ok because it will not have any concurrent commands.
const extractSimpleIds = function ({ filter: { type, attrName, value } }) {
  // No filter
  if (type === undefined) { return; }

  // Check if `args.filter` is too complex to guess model `id`s
  const isSimple = attrName === 'id' && ['eq', 'in'].includes(type);
  if (!isSimple) { return; }

  // Use either type 'eq' or 'in'
  return type === 'in' ? value : [value];
};

module.exports = {
  getSimpleFilter,
  extractSimpleIds,
};
