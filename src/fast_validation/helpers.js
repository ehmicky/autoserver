'use strict';

// Factory functions for often-used tests

const stringTest = name => ({
  test ({ [name]: value }) {
    return value != null && typeof value !== 'string';
  },
  message: 'must be a string',
});

const integerTest = name => ({
  test ({ [name]: value }) {
    return value != null && !Number.isInteger(value);
  },
  message: 'must be an integer',
});

const objectTest = name => ({
  test ({ [name]: value }) {
    return !isObject(value);
  },
  message: 'must be an object',
});

const objectArrayTest = name => ({
  test ({ [name]: value }) {
    return value != null && (!Array.isArray(value) || !value.every(isObject));
  },
  message: 'must be an array of objects',
});

const objectOrArrayTest = name => ({
  test ({ [name]: value }) {
    return value != null &&
      !isObject(value) &&
      (!Array.isArray(value) || !value.every(isObject));
  },
  message: 'must be an object or an array of objects',
});

const isObject = function (value) {
  return value == null || value.constructor === Object;
};

module.exports = {
  stringTest,
  integerTest,
  objectTest,
  objectArrayTest,
  objectOrArrayTest,
};
