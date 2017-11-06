'use strict';

const { pick, omit, assignObject } = require('../../../utilities');

const { getPaginationInfo } = require('./info');
const { decode } = require('./encoding');

// Transform args.pagesize|before|after|page into args.limit|offset|filter
const getPaginationInput = function ({ args }) {
  const info = getPaginationInfo({ args });

  const { isOffset } = info;
  const getInputFunc = isOffset ? getOffsetInput : getTokensInput;
  const paginationNewInput = getInputFunc({ info, args });

  const argsA = omit(args, ['page', 'before', 'after', 'pagesize']);
  const argsB = { ...argsA, ...paginationNewInput };
  return argsB;
};

const getOffsetInput = function ({
  info: { usedPageSize },
  args: { page, pagesize },
}) {
  const offset = (page - 1) * pagesize;
  const limit = usedPageSize;

  return { offset, limit };
};

const getTokensInput = function ({ info, info: { usedPageSize } }) {
  const tokenInput = getTokenInput({ info });
  const backwardInput = getBackwardInput({ info, tokenInput });
  const limit = usedPageSize;
  return { ...tokenInput, ...backwardInput, limit };
};

const getBackwardInput = function ({
  info: { isBackward },
  tokenInput: { orderby },
}) {
  if (!isBackward) { return {}; }

  const orderbyA = orderby.map(({ attrName, order }) =>
    ({ attrName, order: order === 'asc' ? 'desc' : 'asc' }));
  return { orderby: orderbyA };
};

const getTokenInput = function ({ info: { token, hasToken, isBackward } }) {
  if (!hasToken) { return {}; }

  const tokenObj = decode({ token });
  const filter = getPaginatedFilter({ tokenObj, isBackward });
  const { orderby } = tokenObj;

  return { filter, orderby };
};

// Patches args.filter to allow for cursor pagination
// E.g. if:
//  - last paginated model was { b: 2, c: 3, d: 4 }
//  - args.filter is { a: 1 }
//  - args.orderby 'b,c-,d'
// Transform args.filter to
//   [
//      { a: 1, b: { _gt: 2 } },
//      { a: 1, b: 2, c: { _lt: 3 } },
//      { a: 1, b: 2, c: 3, d: { _gt: 4 } },
//   ]
// Using backward pagination would replace _gt to _lt and vice-versa.
const getPaginatedFilter = function ({
  tokenObj,
  tokenObj: { parts, orderby },
  isBackward,
}) {
  const partsObj = parts
    .map((part, index) => ({ [orderby[index].attrName]: part }))
    .reduce(assignObject, {});

  const filter = orderby.map(({ attrName, order }, index) =>
    getFilterPart({ tokenObj, isBackward, partsObj, attrName, order, index }));
  return filter.length === 1
    ? filter[0]
    : { type: '_and', value: filter };
};

const getFilterPart = function ({
  tokenObj: { filter, orderby },
  isBackward,
  partsObj,
  attrName,
  order,
  index,
}) {
  const eqOrders = orderby
    .slice(0, index)
    .map(({ attrName: eqAttrName }) => eqAttrName);
  const eqOrderVals = pick(partsObj, eqOrders);

  const ascOrder = isBackward ? 'desc' : 'asc';
  const matcher = order === ascOrder ? '_gt' : '_lt';
  const orderVal = { [attrName]: { [matcher]: partsObj[attrName] } };

  return { ...filter, ...eqOrderVals, ...orderVal };
};

module.exports = {
  getPaginationInput,
};
