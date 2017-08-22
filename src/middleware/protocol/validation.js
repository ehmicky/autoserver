'use strict';

const { throwError } = require('../../error');

// Protocol-related validation middleware
const protocolValidation = function (input) {
  const { specific } = input;

  if (!specific || specific.constructor !== Object) {
    const message = `'specific' must be an object, not ${specific}`;
    throwError(message, { reason: 'SERVER_INPUT_VALIDATION' });
  }

  return input;
};

module.exports = {
  protocolValidation,
};
