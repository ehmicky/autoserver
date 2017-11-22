'use strict';

const { throwAttrValError } = require('../error');

const { parseAsIs, validateNotArray, validateSameType } = require('./common');

const validateInNin = function ({ value, type, attr, throwErr }) {
  validateNotArray({ type, attr, throwErr });

  if (!Array.isArray(value)) {
    throwAttrValError({ type, throwErr }, 'an array');
  }

  value.forEach(val => validateSameType({ value: val, type, attr, throwErr }));
};

// `{ attribute: { _in: [...] } }`
const evalIn = function ({ attr, value }) {
  return value.includes(attr);
};

// `{ attribute: { _nin: [...] } }`
const evalNin = function ({ attr, value }) {
  return !value.includes(attr);
};

module.exports = {
  _in: {
    parse: parseAsIs,
    validate: validateInNin,
    eval: evalIn,
  },
  _nin: {
    parse: parseAsIs,
    validate: validateInNin,
    eval: evalNin,
  },
};
