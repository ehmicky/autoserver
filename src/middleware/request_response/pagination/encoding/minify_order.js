'use strict';

// Shortcut notation of order,
// e.g. [{ attrName: 'attr', dir: 'asc'}, {attrName: 'attrb', dir: 'desc' }]
// -> 'attr,attrb-'
const minifyOrder = function (token) {
  if (!token.order) { return token; }

  const order = token.order
    .map(({ attrName, dir }) => `${attrName}${dir === 'asc' ? '' : '-'}`)
    .join(',');
  return { ...token, order };
};

const unminifyOrder = function (token) {
  if (!token.order) { return token; }

  const order = token.order
    .split(',')
    .map(orderStr => {
      const isDesc = orderStr[orderStr.length - 1] === '-';
      const attrName = isDesc ? orderStr.slice(0, -1) : orderStr;
      const dir = isDesc ? 'desc' : 'asc';
      return { attrName, dir };
    });
  return { ...token, order };
};

module.exports = {
  minifyOrder,
  unminifyOrder,
};
