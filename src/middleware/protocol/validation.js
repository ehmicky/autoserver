'use strict';

const { throwError } = require('../../errors');

// Protocol-related validation middleware
const protocolValidation = function ({ specific }) {
  if (!specific || specific.constructor !== Object) {
    const message = `'specific' must be an object, not ${specific}`;
    throwError(message, { reason: 'PROTOCOL' });
  }
};

module.exports = {
  protocolValidation,
};
