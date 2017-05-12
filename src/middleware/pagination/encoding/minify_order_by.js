'use strict';


// Shortcut notation of order_by, e.g. [{ attrName: 'attr', order: 'asc', attrName: 'attrb', order: 'desc' }] -> 'attr,attrb-'
const minifyOrderBy = function ({ token }) {
  if (!token.orderBy) { return; }
  token.orderBy = token.orderBy
    .map(({ attrName, order }) => `${attrName}${order === 'asc' ? '' : '-'}`)
    .join(',');
};

const unminifyOrderBy = function ({ token }) {
  if (!token.orderBy) { return; }
  token.orderBy = token.orderBy
    .split(',')
    .map(order => {
      let postfix = order[order.length - 1];
      if (postfix !== '-') {
        order = `${order}+`;
      }
      const attrName = order.slice(0, -1);
      const value = postfix === '+' ? 'asc' : 'desc';
      return { attrName, value };
    });
};


module.exports = {
  minifyOrderBy,
  unminifyOrderBy,
};
