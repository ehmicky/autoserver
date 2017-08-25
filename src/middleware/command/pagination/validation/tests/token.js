'use strict';

const { assignArray } = require('../../../../../utilities');

const getTokenTests = function ({ args }) {
  return ['after', 'before']
    .filter(name => args[name] !== undefined && args[name] !== '')
    .map(getTokenTest)
    .reduce(assignArray, []);
};

const getTokenTest = name => [
  {
    test: [
      ({ args: { [name]: token } }) => token.constructor !== Object,
      ({ args: { [name]: token } }) => ['orderBy', 'filter', 'parts']
        .some(key => !token[key] || typeof token[key] !== 'object'),
      ({ args: { [name]: { parts } } }) =>
        !Array.isArray(parts) || parts.length === 0,
      ({ args: { [name]: { orderBy } } }) =>
        !Array.isArray(orderBy) || orderBy.length === 0,
    ],
    message: `'${name}' argument contains an invalid token`,
  },

  {
    input: ({ args: { [name]: { orderBy } } }) => orderBy,
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
};
