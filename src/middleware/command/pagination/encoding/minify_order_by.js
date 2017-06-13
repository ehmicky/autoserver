'use strict';


// Shortcut notation of order_by,
// e.g. [{ attrName: 'attr', order: 'asc'}, {attrName: 'attrb', order: 'desc' }]
// -> 'attr,attrb-'
const minifyOrderBy = function ({ token }) {
  if (!token.nOrderBy) { return; }
  token.nOrderBy = token.nOrderBy
    .map(({ attrName, order }) => `${attrName}${order === 'asc' ? '' : '-'}`)
    .join(',');
};

const unminifyOrderBy = function ({ token }) {
  if (!token.nOrderBy) { return; }
  token.nOrderBy = token.nOrderBy
    .split(',')
    .map(orderStr => {
      const isDesc = orderStr[orderStr.length - 1] === '-';
      const attrName = isDesc ? orderStr.slice(0, -1) : orderStr;
      const order = isDesc ? 'desc' : 'asc';
      return { attrName, order };
    });
};


module.exports = {
  minifyOrderBy,
  unminifyOrderBy,
};
