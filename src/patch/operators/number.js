'use strict';

const commonTypes = {
  attribute: ['integer', 'number'],
  argument: ['integer', 'number', 'null'],
};

const commonChecks = defaultValue => ({
  ...commonTypes,

  check ({ $arg: opVal = defaultValue, $type: attrType }) {
    checkInteger({ opVal, attrType });
  },
});

const checkInteger = function ({ opVal, attrType }) {
  if (attrType !== 'integer' || Number.isInteger(opVal)) { return; }

  return `the argument must be an integer instead of ${opVal}`;
};

// `_add` patch operator
const addOperator = {
  ...commonChecks(0),

  apply ({ $val: attrVal, $arg: opVal = 0 }) {
    return attrVal + opVal;
  },
};

// `_sub` patch operator
const subOperator = {
  ...commonChecks(0),

  apply ({ $val: attrVal, $arg: opVal = 0 }) {
    return attrVal - opVal;
  },
};

// `_mul` patch operator
const mulOperator = {
  ...commonChecks(1),

  apply ({ $val: attrVal, $arg: opVal = 1 }) {
    return attrVal * opVal;
  },
};

// `_div` patch operator
const divOperator = {
  ...commonTypes,

  check ({ $arg: opVal = 1, $type: attrType }) {
    if (opVal === 0) {
      return 'the argument must not be 0';
    }

    checkInteger({ opVal, attrType });
  },

  apply ({ $val: attrVal, $arg: opVal = 1 }) {
    return attrVal / opVal;
  },
};

module.exports = {
  _add: addOperator,
  _sub: subOperator,
  _div: divOperator,
  _mul: mulOperator,
};
