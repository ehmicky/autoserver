'use strict';

const { throwError } = require('../../error');
const { addIfv } = require('../../idl_func');
const { addReqInfo } = require('../../events');

// Retrieve request's IP, assigned to protocol input,
// and also to IDL function variable $IP
const getIp = function (nextFunc, input) {
  const ip = getRequestIp(input);

  const inputA = addIfv(input, { $IP: ip });
  const inputB = addReqInfo(inputA, { ip });
  const inputC = { ...inputB, ip };

  return nextFunc(inputC);
};

const getRequestIp = function (input) {
  const { protocolHandler } = input;
  const ip = protocolHandler.getIp(input) || '';

  if (typeof ip !== 'string') {
    const message = `'ip' must be a string, not '${ip}'`;
    throwError(message, { reason: 'SERVER_INPUT_VALIDATION' });
  }

  return ip;
};

module.exports = {
  getIp,
};
