'use strict';

const { omit } = require('../../../utilities');

const { getPaginationInfo } = require('./info');
const { decode } = require('./encoding');

// Transform args.pageSize|before|after|page into args.limit|offset|nFilter
const getPaginationInput = function ({ args }) {
  const info = getPaginationInfo({ args });
  const paginationNewInput = getPaginationNewInput({ info, args });

  const argsA = omit(args, ['page', 'before', 'after', 'pageSize']);
  const argsB = { ...argsA, ...paginationNewInput };
  return argsB;
};

const getPaginationNewInput = function ({
  info,
  info: { isOffsetPagination },
  args,
}) {
  if (isOffsetPagination) {
    return getOffsetInput({ info, args });
  }

  return getTokensInput({ info, args });
};

const getOffsetInput = function ({
  info: { usedPageSize },
  args: { page, pageSize },
}) {
  const offset = (page - 1) * pageSize;
  const limit = usedPageSize;

  return { offset, limit };
};

const getTokensInput = function ({ info, info: { usedPageSize }, args }) {
  const tokenInput = getTokenInput({ info, args });
  const backwardInput = getBackwardInput({ info, args });
  const limit = usedPageSize;
  return { ...tokenInput, ...backwardInput, limit };
};

const getTokenInput = function ({
  info: { token, hasToken, isBackward },
  args,
}) {
  if (!hasToken) { return {}; }

  const tokenObj = decode({ token });
  const nFilter = getPaginatedFilter({ tokenObj, isBackward });
  const nOrderBy = tokenObj.nOrderBy || args.nOrderBy;

  return { nFilter, nOrderBy };
};

const getBackwardInput = function ({ info: { isBackward }, args }) {
  if (!isBackward) { return {}; }

  const nOrderBy = args.nOrderBy.map(({ attrName, order }) =>
    ({ attrName, order: order === 'asc' ? 'desc' : 'asc' })
  );
  return { nOrderBy };
};

// Patches args.nFilter to allow for cursor pagination
// E.g. if:
//  - last paginated model was { b: 2, c: 3, d: 4 }
//  - args.nFilter is ($$.a === 1)
//  - args.nOrderBy 'b,c-,d'
// Transform args.nFilter to
//   (($$.a === 1) && (($$.b > 2) || ($$.b === 2 && $$.c < 3) ||
//     ($$.b === 2 && $$.c === 3 && $$.d > 4)))
// Using backward pagination would replace < to > and vice-versa.
const getPaginatedFilter = function ({ tokenObj, isBackward }) {
  const { parts, nFilter, nOrderBy } = tokenObj;
  const extraFilter = `(${tokenToJsl({ parts, nOrderBy, isBackward })})`;
  const filterA = nFilter ? `(${nFilter} && ${extraFilter})` : extraFilter;
  return filterA;
};

const tokenToJsl = function ({ parts, nOrderBy, isBackward }) {
  const mainOrder = isBackward ? 'asc' : 'desc';
  return nOrderBy
    .map(({ attrName, order }, index) =>
      ({ attrName, order, value: parts[index] })
    )
    .map(({ attrName, order, value }, index) => {
      const previousParts = parts
        .slice(0, index)
        .map((val, valIndex) => `$$.${nOrderBy[valIndex].attrName} === ${JSON.stringify(val)}`);
      const operator = order === mainOrder ? '<' : '>';
      const currentPart = `$$.${attrName} ${operator} ${JSON.stringify(value)}`;
      const partJsl = `(${[...previousParts, currentPart].join(' && ')})`;
      return partJsl;
    })
    .join(' || ');
};

module.exports = {
  getPaginationInput,
};
