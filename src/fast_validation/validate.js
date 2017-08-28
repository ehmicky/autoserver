'use strict';

const { throwError } = require('../error');

// Fast validation utility
const fastValidate = function ({ tests, prefix, reason }, ...args) {
  tests.forEach(testParams =>
    validateTest({ prefix, reason, ...testParams }, ...args)
  );
};

const validateTest = function (
  {
    input,
    prefix,
    reason,
    test: testFunc,
    message,
  },
  ...args
) {
  if (input) {
    const argsArray = input(...args);
    return argsArray.forEach(argsA =>
      validateTest({ prefix, reason, test: testFunc, message }, argsA)
    );
  }

  if (Array.isArray(testFunc)) {
    return testFunc.forEach(testFuncA =>
      validateTest({ prefix, reason, test: testFuncA, message }, ...args)
    );
  }

  if (testFunc(...args)) { return; }

  validationFail({ prefix, message, reason }, ...args);
};

const validationFail = function ({ prefix = '', message, reason }, ...args) {
  const messageA = typeof message === 'function' ? message(...args) : message;
  const messageB = `${prefix}${messageA}`;

  throwError(messageB, { reason });
};

module.exports = {
  fastValidate,
};
