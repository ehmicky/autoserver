'use strict';

const { throwAttrTypeError } = require('../error');

const { and } = require('./or_and');

const parseSomeAll = function ({ value, parseOperations }) {
  return parseOperations({ operations: value });
};

const optimizeSomeAll = function (node) {
  // When using an empty array
  if (node.value.length === 0) { return; }

  return node;
};

const validateSomeAll = function ({ type, attrName, attr, throwErr }) {
  if (attr.isArray) { return; }

  throwAttrTypeError({ attrName, attr, type, throwErr }, 'not an array');
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
  return and.eval({ attrs: attr, value: valueA, partialNames, evalFilter });
};

module.exports = {
  some: {
    parse: parseSomeAll,
    optimize: optimizeSomeAll,
    validate: validateSomeAll,
    eval: evalSome,
  },
  all: {
    parse: parseSomeAll,
    optimize: optimizeSomeAll,
    validate: validateSomeAll,
    eval: evalAll,
  },
};
