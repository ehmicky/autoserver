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
      ({ [name]: token }) => token.constructor !== Object,
      ({ [name]: token }) => ['orderBy', 'filter', 'parts']
        .some(key => !token[key] || typeof token[key] !== 'object'),
      ({ [name]: { parts } }) =>
        !Array.isArray(parts) || parts.length === 0,
      ({ [name]: { orderBy } }) =>
        !Array.isArray(orderBy) || orderBy.length === 0,
    ],
    message: `'${name}' argument contains an invalid token`,
  },

  {
    input: ({ [name]: { orderBy } }) => orderBy,
    test: [
      sOrderBy => !sOrderBy || sOrderBy.constructor !== Object,
      sOrderBy => typeof sOrderBy.attrName !== 'string',
      sOrderBy => !['asc', 'desc'].includes(sOrderBy.order),
    ],
    message: `'${name}' argument contains an invalid token`,
  },
];

module.exports = {
  getTokenTests,
  getTokenTest,
};
