'use strict';

const { assignObject } = require('../../../../../utilities');

// Apply `args.order`
const sortResponse = function ({ cursor, order }) {
  if (order === undefined) { return cursor; }

  const orderA = order
    .map(({ attrName, dir }) => ({ [attrName]: dir === 'asc' ? 1 : -1 }))
    .reduce(assignObject, {});
  // eslint-disable-next-line fp/no-mutating-methods
  return cursor.sort(orderA);
};

module.exports = {
  sortResponse,
};
