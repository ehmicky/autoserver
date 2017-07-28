'use strict';

const { throwError } = require('../../error');
const { addJsl } = require('../../jsl');
const { addLogInfo } = require('../../logging');

// Retrieve request's IP, assigned to protocol input, and also to JSL $IP
const getIp = async function (nextFunc, input) {
  const ip = getRequestIp(input);

  const inputA = addJsl(input, { $IP: ip });
  const inputB = addLogInfo(inputA, { ip });
  const inputC = Object.assign({}, inputB, { ip });

  const response = await nextFunc(inputC);
  return response;
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
