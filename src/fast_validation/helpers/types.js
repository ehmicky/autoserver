'use strict';

const { mapValues } = require('../../utilities');

const isObject = function (value) {
  return value.constructor === Object;
};

const isObjectArray = function (value) {
  return Array.isArray(value) && value.every(isObject);
};

const typeTest = ({ test: testFunc, message }) => name => ({
  test ({ [name]: value }) {
    if (value == null) { return true; }

    return testFunc(value);
  },
  message: `'${name}' must be ${message}`,
});

const typeCheckers = {
  stringTest: {
    test: value => typeof value === 'string',
    message: 'a string',
  },

  booleanTest: {
    test: value => typeof value === 'boolean',
    message: 'true or false',
  },

  numberTest: {
    test: value => Number.isFinite(value),
    message: 'a number',
  },

  integerTest: {
    test: value => Number.isInteger(value),
    message: 'an integer',
  },

  objectTest: {
    test: isObject,
    message: 'an object',
  },

  objectArrayTest: {
    test: isObjectArray,
    message: 'an array of objects',
  },

  objectOrArrayTest: {
    test: value => isObject(value) || isObjectArray(value),
    message: 'an array of objects',
  },
};

const typeTests = mapValues(typeCheckers, typeTest);

module.exports = {
  ...typeTests,
};
