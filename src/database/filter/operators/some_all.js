'use strict';

const { throwAttrTypeError } = require('./error');
const { evalAnd } = require('./or_and');

const parseSomeAll = function ({
  opVal,
  attrName,
  attr: { type },
  throwErr,
  parseAttrs,
}) {
  return parseAttrs({
    attrVal: opVal,
    attrName,
    attr: { type, isArray: false },
    throwErr,
  });
};

const validateSomeAll = function ({ opName, attrName, attr, throwErr }) {
  if (attr.isArray) { return; }

  throwAttrTypeError({ attrName, attr, opName, throwErr }, 'not an array');
};

// `{ array_attribute: { some: { ...} } }`
const evalSome = function ({ attr, value, partialNames, evalFilter }) {
  return Object.keys(attr).some(index =>
    arrayMatcher({ attr, index, value, partialNames, evalFilter }));
};

// `{ array_attribute: { all: { ...} } }`
const evalAll = function ({ attr, value, partialNames, evalFilter }) {
  return Object.keys(attr).every(index =>
    arrayMatcher({ attr, index, value, partialNames, evalFilter }));
};

const arrayMatcher = function ({
  attr,
  index,
  value,
  partialNames,
  evalFilter,
}) {
  const valueA = value.map(val => ({ ...val, attrName: index }));
  return evalAnd({ attrs: attr, value: valueA, partialNames, evalFilter });
};

module.exports = {
  parseSomeAll,
  validateSomeAll,
  evalAll,
  evalSome,
};
