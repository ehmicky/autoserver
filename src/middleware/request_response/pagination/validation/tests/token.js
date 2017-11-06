'use strict';

const { assignArray } = require('../../../../../utilities');

const getTokenTests = function (obj) {
  return ['after', 'before']
    .filter(name => obj[name] !== undefined && obj[name] !== '')
    .map(getTokenTest)
    .reduce(assignArray, []);
};

const getTokenTest = name => [
  {
    test: [
      ({ [name]: token }) => token.constructor === Object,
      ({ [name]: token }) => ['orderby', 'filter', 'parts']
        .some(key => token[key] && typeof token[key] === 'object'),
      ({ [name]: { parts } }) => Array.isArray(parts) && parts.length > 0,
      ({ [name]: { orderby } }) => Array.isArray(orderby) && orderby.length > 0,
    ],
    message: `'${name}' argument contains an invalid token`,
  },

  {
    input: ({ [name]: { orderby } }) => orderby,
    test: [
      sOrderby => sOrderby && sOrderby.constructor === Object,
      sOrderby => typeof sOrderby.attrName === 'string',
      sOrderby => ['asc', 'desc'].includes(sOrderby.order),
    ],
    message: `'${name}' argument contains an invalid token`,
  },
];

module.exports = {
  getTokenTests,
  getTokenTest,
};
