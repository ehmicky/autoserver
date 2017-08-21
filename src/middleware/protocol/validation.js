'use strict';

const { throwError } = require('../../error');

// Protocol-related validation middleware
const protocolValidation = function (nextFunc, input) {
  const { specific } = input;

  if (!specific || specific.constructor !== Object) {
    const message = `'specific' must be an object, not ${specific}`;
    throwError(message, { reason: 'SERVER_INPUT_VALIDATION' });
  }

  return nextFunc(input);
};

module.exports = {
  protocolValidation,
};
