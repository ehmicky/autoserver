'use strict';

const { ANY_ARRAY } = require('./array');

const checkSlice = function ({ $arg: opVal }) {
  if (opVal.length <= 2) { return; }

  return 'the argument must be an array with one integer (the index) and an optional additional integer (the length)';
};

const commonAttrs = {
  argument: ['integer[]'],

  check: checkSlice,
};

// `_slicestr` patch operator
const slicestrOperator = {
  ...commonAttrs,

  attribute: ['string'],

  apply ({ $val: attrVal, $arg: [index, length] }) {
    return attrVal.substr(index, length);
  },
};

// `_slice` patch operator
const sliceOperator = {
  ...commonAttrs,

  attribute: ANY_ARRAY,

  apply ({ $val: attrVal, $arg: [index, length] }) {
    return attrVal.slice(index, length);
  },
};

module.exports = {
  _slicestr: slicestrOperator,
  _slice: sliceOperator,
};
