'use strict';

const { difference, sortArray, reverseArray } = require('../../../utilities');

const { ANY_ARRAY } = require('./constants');

const commonAttrs = {
  attribute: ANY_ARRAY,

  argument: ANY_ARRAY,
};

const commonEmptyAttrs = {
  attribute: ANY_ARRAY,

  argument: ['empty'],
};

// `_push` patch operator
const pushOperator = {
  ...commonAttrs,

  apply ({ val: attrVal = [], arg: opVal = [] }) {
    return [...attrVal, ...opVal];
  },
};

// `_unshift` patch operator
const unshiftOperator = {
  ...commonAttrs,

  apply ({ val: attrVal = [], arg: opVal = [] }) {
    return [...opVal, ...attrVal];
  },
};

// `_pop` patch operator
const popOperator = {
  ...commonEmptyAttrs,

  apply ({ val: attrVal = [] }) {
    return attrVal.slice(0, -1);
  },
};

// `_shift` patch operator
const shiftOperator = {
  ...commonEmptyAttrs,

  apply ({ val: attrVal = [] }) {
    return attrVal.slice(1);
  },
};

// `_remove` patch operator
const removeOperator = {
  ...commonAttrs,

  apply ({ val: attrVal = [], arg: opVal = [] }) {
    return difference(attrVal, opVal);
  },
};

// `_sort` patch operator
const sortOperator = {
  attribute: ANY_ARRAY,

  argument: ['string'],

  check ({ arg: order }) {
    if (['asc', 'desc'].includes(order)) { return; }

    return 'the argument\'s value must be \'asc\' or \'desc\'';
  },

  apply ({ val: attrVal = [], arg: order = 'asc' }) {
    const attrValA = sortArray(attrVal);
    return order === 'asc' ? attrValA : reverseArray(attrValA);
  },
};

module.exports = {
  _push: pushOperator,
  _unshift: unshiftOperator,
  _pop: popOperator,
  _shift: shiftOperator,
  _remove: removeOperator,
  _sort: sortOperator,
};
