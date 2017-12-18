'use strict';

const { throwError } = require('../../error');

// Protocol-related validation middleware
const protocolValidation = function ({ specific }) {
  if (!specific || specific.constructor !== Object) {
    const message = `'specific' must be an object, not ${specific}`;
    throwError(message, { reason: 'ENGINE' });
  }
};

module.exports = {
  protocolValidation,
};
