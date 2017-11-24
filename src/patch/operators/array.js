'use strict';

const ANY_ARRAY = [
  'boolean[]',
  'integer[]',
  'number[]',
  'string[]',
  'object[]',
  'null[]',
];

// `_push` patch operator
const pushOperator = {
  attribute: ANY_ARRAY,

  argument: ANY_ARRAY,

  apply (attrVal, opVal) {
    return [...attrVal, ...opVal];
  },
};

// `_unshift` patch operator
const unshiftOperator = {
  attribute: ANY_ARRAY,

  argument: ANY_ARRAY,

  apply (attrVal, opVal) {
    return [...opVal, ...attrVal];
  },
};

// `_slice` patch operator
const sliceOperator = {
  attribute: ANY_ARRAY,

  argument: ['integer[]'],

  check (opVal) {
    if (opVal.length <= 2) { return; }

    return 'the argument must be an array with one integer (the index) and an optional additional integer (the length)';
  },

  apply (attrVal, [index, length]) {
    return attrVal.slice(index, length);
  },
};

// `_insert` patch operator
const insertOperator = {
  attribute: ANY_ARRAY,

  argument: ANY_ARRAY,

  check ([index]) {
    const isValid = Number.isInteger(index);
    if (isValid) { return; }

    return 'the argument\'s first value must be an integer (the index)';
  },

  apply (attrVal, [index, ...values]) {
    const beginning = attrVal.slice(0, index);
    const end = attrVal.slice(index);
    return [...beginning, ...values, ...end];
  },
};

module.exports = {
  _push: pushOperator,
  _unshift: unshiftOperator,
  _slice: sliceOperator,
  _insert: insertOperator,
};
