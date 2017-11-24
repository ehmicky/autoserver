'use strict';

// `_set` patch operator
const setOperator = {
  apply (attrVal, opVal) {
    return opVal;
  },
};

module.exports = {
  _set: setOperator,
};
