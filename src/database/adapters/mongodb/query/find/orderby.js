'use strict';

const { assignObject } = require('../../../../../utilities');

// Apply `args.orderby`
const sortResponse = function ({ cursor, orderby }) {
  if (orderby === undefined) { return cursor; }

  const orderbyA = orderby
    .map(({ attrName, order }) => ({ [attrName]: order === 'asc' ? 1 : -1 }))
    .reduce(assignObject, {});
  // eslint-disable-next-line fp/no-mutating-methods
  return cursor.sort(orderbyA);
};

module.exports = {
  sortResponse,
};
