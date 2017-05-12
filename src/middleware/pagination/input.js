'use strict';


const { omit } = require('lodash');

const { getPaginationInfo } = require('./info');
const { decode } = require('./encoding');


// Transform args.page_size|before|after|page into args.limit|offset|filter
const getPaginationInput = function ({ args }) {
  const { token, hasToken, isBackward, usedPageSize } = getPaginationInfo({ args });
  const newArgs = omit(args, ['before', 'after', 'page_size']);

  if (hasToken) {
    newArgs.filter = getPaginatedFilter({ args, token, isBackward });
  }
  if (isBackward) {
    newArgs.order_by = args.order_by.map(({ attrName, order }) => ({ attrName, order: order === 'asc' ? 'desc' : 'asc' }));
  }
  newArgs.limit = usedPageSize;

  return { args: newArgs };
};

// Patches args.filter to allow for cursor pagination
// E.g. if:
//  - last paginated model was { b: 2, c: 3, d: 4 }
//  - arg.filter is ($$.a === 1)
//  - arg.order_by 'b,c-,d'
// Transform arg.filter to
//   (($$.a === 1) && (($$.b > 2) || ($$.b === 2 && $$.c < 3) || ($$.b === 2 && $$.c === 3 && $$.d > 4)))
// Using backward pagination would replace < to > and vice-versa.
const getPaginatedFilter = function ({ args: { filter, order_by: orderBy }, token, isBackward }) {
  const { parts } = decode({ token });
  const extraFilter = `(${tokenToJsl({ parts, orderBy, isBackward })})`;
  const newFilter = filter ? `(${filter} && ${extraFilter})` : extraFilter;
  return newFilter;
};

const tokenToJsl = function ({ parts, orderBy, isBackward }) {
  const mainOrder = isBackward ? 'asc' : 'desc';
  return orderBy
    .map(({ attrName, order }, index) => ({ attrName, order, value: parts[index] }))
    .map(({ attrName, order, value }, index) => {
      const previousParts = parts
        .slice(0, index)
        .map((value, i) => `$$.${orderBy[i].attrName} === ${JSON.stringify(value)}`);
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
