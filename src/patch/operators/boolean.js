'use strict';

// `_invert` patch operator
const invertOperator = {
  attribute: ['boolean'],

  argument: ['null'],

  apply (attrVal) {
    return !attrVal;
  },
};

module.exports = {
  _invert: invertOperator,
};
