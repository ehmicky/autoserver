'use strict';

// `_set` patch operator
const setOperator = {
  apply ({ $arg: opVal }) {
    return opVal;
  },
};

module.exports = {
  _set: setOperator,
};
