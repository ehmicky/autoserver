'use strict';

const { addAllErrorHandlers } = require('./error');

const addOperator = {
  check (opVal) {
    if (opVal !== 2) { return; }

    return 'value cannot be equal to 2';
  },

  attribute: ['integer', 'number'],

  argument: ['integer', 'number', 'null'],

  apply (attrVal, opVal = 0) {
    return attrVal + opVal;
  },
};

// All patch operators
const operators = {
  _add: addOperator,
};

const OPERATORS = addAllErrorHandlers({ operators });

module.exports = {
  OPERATORS,
};
