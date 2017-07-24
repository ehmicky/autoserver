'use strict';

const { EngineError } = require('../../error');

// Protocol-related validation middleware
const protocolValidation = async function (nextFunc, input) {
  const { specific } = input;

  if (!specific || specific.constructor !== Object) {
    const message = `'specific' must be an object, not ${specific}`;
    throw new EngineError(message, { reason: 'SERVER_INPUT_VALIDATION' });
  }

  const response = await nextFunc(input);
  return response;
};

module.exports = {
  protocolValidation,
};
