'use strict';

const { throwAttrValError } = require('../error');

const {
  parseAsIs,
  validateNotArrayOps,
  validateSameType,
} = require('./common');

const validateInNin = function ({ value, type, attr, throwErr }) {
  validateNotArrayOps({ type, attr, throwErr });

  if (!Array.isArray(value)) {
    throwAttrValError({ type, throwErr }, 'an array');
  }

  value.forEach(val =>
    validateSameType({ value: val, type, attr, throwErr }));
};

// `{ attribute: { in: [...] } }`
const evalIn = function ({ attr, value }) {
  return value.includes(attr);
};

// `{ attribute: { nin: [...] } }`
const evalNin = function ({ attr, value }) {
  return !value.includes(attr);
};

module.exports = {
  in: {
    parse: parseAsIs,
    validate: validateInNin,
    eval: evalIn,
  },
  nin: {
    parse: parseAsIs,
    validate: validateInNin,
    eval: evalNin,
  },
};
