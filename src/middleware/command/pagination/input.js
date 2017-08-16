'use strict';

const { pick, omit, assignObject } = require('../../../utilities');

const { getPaginationInfo } = require('./info');
const { decode } = require('./encoding');

// Transform args.pageSize|before|after|page into args.limit|offset|filter
const getPaginationInput = function ({ args }) {
  const info = getPaginationInfo({ args });

  const { isOffset } = info;
  const getInputFunc = isOffset ? getOffsetInput : getTokensInput;
  const paginationNewInput = getInputFunc({ info });

  const argsA = omit(args, ['page', 'before', 'after', 'pageSize']);
  const argsB = { ...argsA, ...paginationNewInput };
  return argsB;
};

const getOffsetInput = function ({
  info: { usedPageSize },
  args: { page, pageSize },
}) {
  const offset = (page - 1) * pageSize;
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
  tokenInput: { nOrderBy },
}) {
  if (!isBackward) { return {}; }

  const nOrderByA = nOrderBy.map(({ attrName, order }) =>
    ({ attrName, order: order === 'asc' ? 'desc' : 'asc' })
  );
  return { nOrderBy: nOrderByA };
};

const getTokenInput = function ({ info: { token, hasToken, isBackward } }) {
  if (!hasToken) { return {}; }

  const tokenObj = decode({ token });
  const filter = getPaginatedFilter({ tokenObj, isBackward });
  const { nOrderBy } = tokenObj;

  return { filter, nOrderBy };
};

// Patches args.filter to allow for cursor pagination
// E.g. if:
//  - last paginated model was { b: 2, c: 3, d: 4 }
//  - args.filter is { a: 1 }
//  - args.nOrderBy 'b,c-,d'
// Transform args.filter to
//   [
//      { a: 1, b: { gt: 2 } },
//      { a: 1, b: 2, c: { lt: 3 } },
//      { a: 1, b: 2, c: 3, d: { gt: 4 } },
//   ]
// Using backward pagination would replace gt to lt and vice-versa.
const getPaginatedFilter = function ({
  tokenObj,
  tokenObj: { parts, nOrderBy },
  isBackward,
}) {
  const partsObj = parts
    .map((part, index) => ({ [nOrderBy[index].attrName]: part }))
    .reduce(assignObject, {});

  const filter = nOrderBy.map(({ attrName, order }, index) =>
    getFilterPart({ tokenObj, isBackward, partsObj, attrName, order, index })
  );
  const filterA = filter.length === 1 ? filter[0] : filter;

  return filterA;
};

const getFilterPart = function ({
  tokenObj: { filter, nOrderBy },
  isBackward,
  partsObj,
  attrName,
  order,
  index,
}) {
  const eqOrders = nOrderBy
    .slice(0, index)
    .map(({ attrName: eqAttrName }) => eqAttrName);
  const eqOrderVals = pick(partsObj, eqOrders);

  const ascOrder = isBackward ? 'desc' : 'asc';
  const matcher = order === ascOrder ? 'gt' : 'lt';
  const orderVal = { [attrName]: { [matcher]: partsObj[attrName] } };

  return { ...filter, ...eqOrderVals, ...orderVal };
};

module.exports = {
  getPaginationInput,
};
