'use strict';

// `_invert` patch operator
const invertOperator = {
  attribute: ['boolean'],

  argument: ['empty'],

  apply ({ value: attrVal = false }) {
    return !attrVal;
  },
};

module.exports = {
  _invert: invertOperator,
};
