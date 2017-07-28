'use strict';

const { throwError } = require('../../error');
const { addLogInfo } = require('../../logging');

const getProtocolName = async function (nextFunc, input) {
  const { specific, protocolHandler } = input;

  const protocolFullName = getProtocolFullName({ specific, protocolHandler });

  const inputA = addLogInfo(input, { protocolFullName });
  const inputB = { ...inputA, protocolFullName };

  const response = await nextFunc(inputB);
  return response;
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
