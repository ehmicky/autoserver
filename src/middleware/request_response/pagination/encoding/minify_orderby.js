'use strict';

// Shortcut notation of orderby,
// e.g. [{ attrName: 'attr', order: 'asc'}, {attrName: 'attrb', order: 'desc' }]
// -> 'attr,attrb-'
const minifyOrderby = function (token) {
  if (!token.orderby) { return token; }
  const orderby = token.orderby
    .map(({ attrName, order }) => `${attrName}${order === 'asc' ? '' : '-'}`)
    .join(',');
  return { ...token, orderby };
};

const unminifyOrderby = function (token) {
  if (!token.orderby) { return token; }
  const orderby = token.orderby
    .split(',')
    .map(orderStr => {
      const isDesc = orderStr[orderStr.length - 1] === '-';
      const attrName = isDesc ? orderStr.slice(0, -1) : orderStr;
      const order = isDesc ? 'desc' : 'asc';
      return { attrName, order };
    });
  return { ...token, orderby };
};

module.exports = {
  minifyOrderby,
  unminifyOrderby,
};
