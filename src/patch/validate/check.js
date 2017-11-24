'use strict';

const { decapitalize } = require('underscore.string');

// Uses `patchOp.check()`
const applyCheck = function ({ opVal, type, operator: { check } }) {
  if (check === undefined) { return; }

  // Normalize `null` to `undefined`
  const opValA = opVal === null ? undefined : opVal;

  const message = check(opValA);

  const messageA = getCheckMessage({ type, message });
  return messageA;
};

const getCheckMessage = function ({ type, message }) {
  if (message === undefined) { return; }

  if (typeof message === 'string') {
    return decapitalize(message);
  }

  const messageA = `patch operator '${type}' check() function must return either a string or undefined, not ${typeof message}`;
  return { message: messageA, reason: 'UTILITY_ERROR' };
};

module.exports = {
  applyCheck,
};
