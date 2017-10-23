'use strict';

const { assignObject } = require('../../../../../utilities');

// Apply `args.order_by`
const sortResponse = function ({ cursor, orderBy }) {
  if (orderBy === undefined) { return cursor; }

  const orderByA = orderBy
    .map(({ attrName, order }) => ({ [attrName]: order === 'asc' ? 1 : -1 }))
    .reduce(assignObject, {});
  // eslint-disable-next-line fp/no-mutating-methods
  return cursor.sort(orderByA);
};

module.exports = {
  sortResponse,
};
