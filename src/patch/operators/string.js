'use strict';

// `_slicestr` patch operator
const sliceOperator = {
  attribute: ['string'],

  argument: ['integer[]'],

  check (opVal) {
    if (opVal.length <= 2) { return; }

    return 'the argument must be an array with one integer (the index) and an optional additional integer (the length)';
  },

  apply (attrVal, [index, length]) {
    return attrVal.substr(index, length);
  },
};

module.exports = {
  _slicestr: sliceOperator,
};
