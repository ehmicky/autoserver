'use strict';

// Adapter feature 'order_by' allows for `args.order_by`
const orderByValidator = function ({ args: { orderBy } }) {
  if (orderBy === undefined) { return; }

  return 'Must not use argument \'order_by\'';
};

module.exports = {
  orderByValidator,
};
