'use strict';

// `_invert` patch operator
const invertOperator = {
  attribute: ['boolean'],

  argument: ['empty'],

  apply ({ val: attrVal = false }) {
    return !attrVal;
  },
};

module.exports = {
  _invert: invertOperator,
};
