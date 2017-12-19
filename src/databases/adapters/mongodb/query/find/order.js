'use strict';

// Apply `args.order`
const sortResponse = function ({ cursor, order }) {
  if (order === undefined) { return cursor; }

  const orderA = order
    .map(({ attrName, dir }) => ({ [attrName]: dir === 'asc' ? 1 : -1 }));
  const orderB = Object.assign({}, ...orderA);
  // eslint-disable-next-line fp/no-mutating-methods
  return cursor.sort(orderB);
};

module.exports = {
  sortResponse,
};
