'use strict';

const { omit } = require('../../../utilities');

const { getPaginationInfo } = require('./info');
const { decode } = require('./encoding');

// Transform args.pageSize|before|after|page into args.limit|offset|nFilter
const getPaginationInput = function ({ args }) {
  const { page, pageSize } = args;
  const {
    token,
    hasToken,
    isBackward,
    usedPageSize,
    isOffsetPagination,
  } = getPaginationInfo({ args });
  const newArgs = omit(args, ['page', 'before', 'after', 'pageSize']);

  if (isOffsetPagination) {
    newArgs.offset = (page - 1) * pageSize;
  } else {
    if (hasToken) {
      const tokenObj = decode({ token });
      newArgs.nFilter = getPaginatedFilter({ tokenObj, isBackward });
      newArgs.nOrderBy = tokenObj.nOrderBy || newArgs.nOrderBy;
    }

    if (isBackward) {
      newArgs.nOrderBy = newArgs.nOrderBy.map(({ attrName, order }) =>
        ({ attrName, order: order === 'asc' ? 'desc' : 'asc' })
      );
    }
  }

  newArgs.limit = usedPageSize;

  return newArgs;
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
  const newFilter = nFilter ? `(${nFilter} && ${extraFilter})` : extraFilter;
  return newFilter;
};

const tokenToJsl = function ({ parts, nOrderBy, isBackward }) {
  const mainOrder = isBackward ? 'asc' : 'desc';
  return nOrderBy
    .map(({ attrName, order }, index) => ({ attrName, order, value: parts[index] }))
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
