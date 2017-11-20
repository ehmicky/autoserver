'use strict';

const { pick, omit } = require('../../../utilities');

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
  info: { usedPagesize },
  args: { page, pagesize },
}) {
  const offset = (page - 1) * pagesize;
  const limit = usedPagesize;

  return { offset, limit };
};

const getTokensInput = function ({ info, info: { usedPagesize } }) {
  const tokenInput = getTokenInput({ info });
  const backwardInput = getBackwardInput({ info, tokenInput });
  const limit = usedPagesize;
  return { ...tokenInput, ...backwardInput, limit };
};

const getBackwardInput = function ({
  info: { isBackward },
  tokenInput: { order },
}) {
  if (!isBackward) { return {}; }

  const orderA = order.map(({ attrName, dir }) =>
    ({ attrName, dir: dir === 'asc' ? 'desc' : 'asc' }));
  return { order: orderA };
};

const getTokenInput = function ({ info: { token, hasToken, isBackward } }) {
  if (!hasToken) { return {}; }

  const tokenObj = decode({ token });
  const filter = getPaginatedFilter({ tokenObj, isBackward });
  const { order } = tokenObj;

  return { filter, order };
};

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
const getPaginatedFilter = function ({
  tokenObj,
  tokenObj: { parts, order },
  isBackward,
}) {
  const partsObj = parts
    .map((part, index) => ({ [order[index].attrName]: part }));
  const partsObjA = Object.assign({}, ...partsObj);

  const filter = order.map(({ attrName, dir }, index) => getFilterPart({
    tokenObj,
    isBackward,
    partsObj: partsObjA,
    attrName,
    dir,
    index,
  }));
  return filter.length === 1
    ? filter[0]
    : { type: '_and', value: filter };
};

const getFilterPart = function ({
  tokenObj: { filter, order },
  isBackward,
  partsObj,
  attrName,
  dir,
  index,
}) {
  const eqOrders = order
    .slice(0, index)
    .map(({ attrName: eqAttrName }) => eqAttrName);
  const eqOrderVals = pick(partsObj, eqOrders);

  const ascDir = isBackward ? 'desc' : 'asc';
  const matcher = dir === ascDir ? '_gt' : '_lt';
  const orderVal = { [attrName]: { [matcher]: partsObj[attrName] } };

  return { ...filter, ...eqOrderVals, ...orderVal };
};

module.exports = {
  getPaginationInput,
};
