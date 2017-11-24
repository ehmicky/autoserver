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

// `_insertstr` patch operator
const insertOperator = {
  attribute: ['string'],

  argument: ['integer[]', 'string[]'],

  check (opVal) {
    const isValid = opVal.length === 2 &&
      Number.isInteger(opVal[0]) &&
      typeof opVal[1] === 'string';
    if (isValid) { return; }

    return 'the argument must be an array with one integer (the index) and a string';
  },

  apply (attrVal, [index, str]) {
    const indexA = index < 0 ? Math.max(attrVal.length + index, 0) : index;
    const beginning = attrVal.substr(0, indexA);
    const end = attrVal.substr(indexA);
    return `${beginning}${str}${end}`;
  },
};

module.exports = {
  _slicestr: sliceOperator,
  _insertstr: insertOperator,
};
