'use strict';

const { throwError } = require('../../error');
const { addJsl } = require('../../jsl');
const { addLogInfo } = require('../../logging');

// Retrieve request's IP, assigned to protocol input, and also to JSL $IP
const getIp = async function (nextFunc, input) {
  const { jsl } = input;

  const ip = getRequestIp(input);

  const newInput = addJsl({ input, jsl, params: { $IP: ip } });
  const loggedInput = addLogInfo(newInput, { ip });
  const nextInput = Object.assign({}, loggedInput, { ip });

  const response = await nextFunc(nextInput);
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
