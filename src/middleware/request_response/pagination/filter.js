'use strict';

const { getBackwardFilter } = require('./backward');

// Patches args.filter to allow for cursor pagination
// E.g. if:
//  - last paginated model was { b: 2, c: 3, d: 4 }
//  - args.filter is { a: 1 }
//  - args.order 'b,c-,d'
// Transform args.filter to
//   [
//      { a: 1, b: { _gt: 2 } },
//      { a: 1, b: 2, c: { _lt: 3 } },
//      { a: 1, b: 2, c: 3, d: { _gt: 4 } },
//   ]
// Using backward pagination would replace _gt to _lt and vice-versa.
const getTokenFilter = function ({ args, token }) {
  if (token === undefined) { return; }

  const filter = getPaginatedFilter({ args, token });
  return { filter };
};

const getPaginatedFilter = function ({
  args,
  args: { filter, order },
  token: { parts },
}) {
  const partsObj = parts
    .map((part, index) => ({ [order[index].attrName]: part }));
  const partsObjA = Object.assign({}, ...partsObj);

  const extraFilters = order
    .map(({ attrName, dir }, index) => getExtraFilters({
      args,
      order,
      partsObj: partsObjA,
      attrName,
      dir,
      index,
    }));
  const filterA = mergeExtraFilters({ extraFilters, filter });
  return filterA;
};

const getExtraFilters = function ({
  args,
  order,
  partsObj,
  attrName,
  dir,
  index,
}) {
  const eqOrders = order
    .slice(0, index)
    .map(sOrder => getEqOrder({ partsObj, sOrder }));

  const type = dir === 'asc' ? '_gt' : '_lt';
  const orderVal = { type, attrName, value: partsObj[attrName] };

  const orderValA = getBackwardFilter({ args, node: orderVal });

  if (eqOrders.length === 0) {
    return orderValA;
  }

  return { type: '_and', value: [...eqOrders, orderValA] };
};

const getEqOrder = function ({ partsObj, sOrder: { attrName } }) {
  return { type: '_eq', attrName, value: partsObj[attrName] };
};

const mergeExtraFilters = function ({ extraFilters, filter }) {
  const extraFiltersA = extraFilters.length === 1
    ? extraFilters[0]
    : { type: '_or', value: extraFilters };

  if (filter === undefined) {
    return extraFiltersA;
  }

  return { type: '_and', value: [filter, extraFiltersA] };
};

module.exports = {
  getTokenFilter,
};
