'use strict';

const { ANY_ARRAY } = require('./array');

const checkSlice = function ({ arg: opVal }) {
  if (opVal.length <= 2) { return; }

  return 'the argument must be an array with one integer (the index) and an optional additional integer (the length)';
};

const commonAttrs = {
  argument: ['integer[]', 'empty[]'],

  check: checkSlice,
};

// Negative indexes are from the end. Null indexes are representing the end.
// Positive indexes are from the start.
const argToIndex = function (arg, attrVal) {
  if (arg == null) { return attrVal.length; }

  if (arg >= 0) { return arg; }

  return attrVal.length + arg;
};

const sliceApply = function ({ attrVal, start, end }) {
  const startA = argToIndex(start, attrVal);
  const endA = argToIndex(end, attrVal);
  return attrVal.slice(startA, endA);
};

// `_slicestr` patch operator
const slicestrOperator = {
  ...commonAttrs,

  attribute: ['string'],

  apply ({ value: attrVal = '', arg: [start, end] }) {
    return sliceApply({ attrVal, start, end });
  },
};

// `_slice` patch operator
const sliceOperator = {
  ...commonAttrs,

  attribute: ANY_ARRAY,

  apply ({ value: attrVal = [], arg: [start, end] }) {
    return sliceApply({ attrVal, start, end });
  },
};

const insertApply = function ({ index, attrVal }) {
  const indexA = argToIndex(index, attrVal);
  const start = attrVal.slice(0, indexA);
  const end = attrVal.slice(indexA);
  return { start, end };
};

// `_insertstr` patch operator
const insertstrOperator = {
  attribute: ['string'],

  argument: ['integer[]', 'empty[]', 'string[]'],

  check ({ arg: opVal }) {
    if (isValidInsertstr({ opVal })) { return; }

    return 'the argument must be an array with one integer (the index) and a string';
  },

  apply ({ value: attrVal = '', arg: [index, str] }) {
    const { start, end } = insertApply({ index, attrVal });
    return `${start}${str}${end}`;
  },
};

const isValidInsertstr = function ({ opVal }) {
  return opVal.length === 2 &&
    (Number.isInteger(opVal[0]) || opVal[0] == null) &&
    typeof opVal[1] === 'string';
};

// `_insert` patch operator
const insertOperator = {
  attribute: ANY_ARRAY,

  argument: ANY_ARRAY,

  check ({ arg: [index] }) {
    const isValid = Number.isInteger(index) || index == null;
    if (isValid) { return; }

    return 'the argument\'s first value must be an integer (the index)';
  },

  apply ({ value: attrVal = [], arg: [index, ...values] }) {
    const { start, end } = insertApply({ index, attrVal });
    return [...start, ...values, ...end];
  },
};

module.exports = {
  _slicestr: slicestrOperator,
  _slice: sliceOperator,
  _insertstr: insertstrOperator,
  _insert: insertOperator,
};
