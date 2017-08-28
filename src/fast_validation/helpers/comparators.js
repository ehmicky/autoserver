'use strict';

const { result, mapValues } = require('../../utilities');

const compTest = ({ test: testFunc, message }) => (name, number) => ({
  test (arg) {
    const { [name]: value } = arg;
    if (value == null) { return true; }

    return testFunc(value, result(number, arg));
  },
  message: arg => `'${name}' must ${message} ${result(number, arg)}`,
});

const comparators = {
  eqTest: {
    test: (val, val2) => val === val2,
    message: 'be equal to',
  },

  neTest: {
    test: (val, val2) => val !== val2,
    message: 'not be equal to',
  },

  gtTest: {
    test: (val, val2) => val > val2,
    message: 'be greater than',
  },

  geTest: {
    test: (val, val2) => val >= val2,
    message: 'be greater than or equal to',
  },

  ltTest: {
    test: (val, val2) => val < val2,
    message: 'be less than',
  },

  leTest: {
    test: (val, val2) => val <= val2,
    message: 'be less than or equal to',
  },
};

const compTests = mapValues(comparators, compTest);

module.exports = {
  ...compTests,
};
