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
      ({ [name]: token }) => ['order', 'filter', 'parts']
        .some(key => token[key] && typeof token[key] === 'object'),
      ({ [name]: { parts } }) => Array.isArray(parts) && parts.length > 0,
      ({ [name]: { order } }) => Array.isArray(order) && order.length > 0,
    ],
    message: `'${name}' argument contains an invalid token`,
  },

  {
    input: ({ [name]: { order } }) => order,
    test: [
      sOrder => sOrder && sOrder.constructor === Object,
      sOrder => typeof sOrder.attrName === 'string',
      sOrder => ['asc', 'desc'].includes(sOrder.dir),
    ],
    message: `'${name}' argument contains an invalid token`,
  },
];

module.exports = {
  getTokenTests,
  getTokenTest,
};
