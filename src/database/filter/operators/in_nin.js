'use strict';

const { throwAttrValError } = require('./error');
const { validateNotArrayOps, validateSameType } = require('./common');

const validateInNin = function ({ opVal, opName, attrName, attr, throwErr }) {
  validateNotArrayOps({ opName, attrName, attr, throwErr });

  if (!Array.isArray(opVal)) {
    throwAttrValError({ attrName, opName, throwErr }, 'an array');
  }

  opVal.forEach(val =>
    validateSameType({ opVal: val, opName, attrName, attr, throwErr }));
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
  validateInNin,
  evalIn,
  evalNin,
};
