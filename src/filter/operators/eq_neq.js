'use strict';

const { isEqual } = require('../../utilities');

const { validateSameType, parseAsIs } = require('./common');

// `{ attribute: { eq: value } }` or `{ attribute: value }`
const evalEq = function ({ attr, value }) {
  return isEqual(attr, value);
};

// `{ attribute: { neq: value } }`
const evalNeq = function ({ attr, value }) {
  return !isEqual(attr, value);
};

module.exports = {
  eq: {
    parse: parseAsIs,
    validate: validateSameType,
    eval: evalEq,
  },
  neq: {
    parse: parseAsIs,
    validate: validateSameType,
    eval: evalNeq,
  },
};
