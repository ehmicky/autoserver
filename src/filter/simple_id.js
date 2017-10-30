'use strict';

const { uniq, intersection } = require('lodash');

// Try to guess the model `id`s by looking at `args.filter`
// This won't work on top-level filter of findMany command using a complex one,
// but that's ok because it will not have any concurrent commands.
// Returns undefined if it is impossible to guess. Returns empty array if the
// client specifically asked for no `id`s, e.g. `{ filter: { id: { in: [] } } }`
const extractSimpleIds = function ({ filter: { type, attrName, value } = {} }) {
  if (type === 'and') {
    return parseAndNode({ value });
  }

  const isSimple = isSimpleFilter({ type, attrName });
  if (!isSimple) { return; }

  const ids = getIds({ type, value });
  return ids;
};

// Parses 'and' top-level node
const parseAndNode = function ({ value }) {
  const idsA = value.map(node => extractSimpleIds({ filter: node }));

  const isSimple = idsA.every(ids => Array.isArray(ids));
  // E.g. `{ id: '5', name: '...' }`
  if (!isSimple) { return; }

  const idsB = intersection(...idsA);
  return idsB;
};

// Check if `args.filter` is simple enough to guess model `id`s
const isSimpleFilter = function ({ type, attrName }) {
  // Means there is no filter
  if (type === undefined) { return false; }

  return attrName === 'id' && ['eq', 'in'].includes(type);
};

const getIds = function ({ type, value }) {
  // Use either type 'eq' or 'in'
  const ids = type === 'in' ? value : [value];

  const idsA = uniq(ids);

  return idsA;
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
