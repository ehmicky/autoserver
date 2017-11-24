'use strict';

const { difference, sortArray, reverseArray } = require('../../../utilities');

const { ANY_ARRAY } = require('./constants');

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

// `_pop` patch operator
const popOperator = {
  attribute: ANY_ARRAY,

  argument: ['null'],

  apply (attrVal) {
    return attrVal.slice(0, -1);
  },
};

// `_shift` patch operator
const shiftOperator = {
  attribute: ANY_ARRAY,

  argument: ['null'],

  apply (attrVal) {
    return attrVal.slice(1);
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

// `_remove` patch operator
const removeOperator = {
  attribute: ANY_ARRAY,

  argument: ANY_ARRAY,

  apply (attrVal, opVal) {
    return difference(attrVal, opVal);
  },
};

// `_sort` patch operator
const sortOperator = {
  attribute: ANY_ARRAY,

  argument: ['string'],

  check (order) {
    if (['asc', 'desc'].includes(order)) { return; }

    return 'the argument\'s value must be \'asc\' or \'desc\'';
  },

  apply (attrVal, order) {
    const attrValA = sortArray(attrVal);
    return order === 'asc' ? attrValA : reverseArray(attrValA);
  },
};

module.exports = {
  _push: pushOperator,
  _unshift: unshiftOperator,
  _pop: popOperator,
  _shift: shiftOperator,
  _slice: sliceOperator,
  _insert: insertOperator,
  _remove: removeOperator,
  _sort: sortOperator,
};
