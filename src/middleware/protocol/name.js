'use strict';

const { throwError } = require('../../error');
const { addReqInfo } = require('../../events');

const getProtocolName = function (nextFunc, input) {
  const { specific, protocolHandler } = input;

  const protocolFullName = getProtocolFullName({ specific, protocolHandler });

  const inputA = addReqInfo(input, { protocolFullName });
  const inputB = { ...inputA, protocolFullName };

  return nextFunc(inputB);
};

const getProtocolFullName = function ({ specific, protocolHandler }) {
  const protocolFullName = protocolHandler.getFullName({ specific });

  if (typeof protocolFullName !== 'string') {
    const message = `'protocolFullName' must be a string, not ${protocolFullName}`;
    throwError(message, { reason: 'SERVER_INPUT_VALIDATION' });
  }

  return protocolFullName;
};

module.exports = {
  getProtocolName,
};
