'use strict';

const { EngineError } = require('../../error');

// Retrieve request's IP, assigned to protocol input, and also to JSL $IP
const getIp = async function (input) {
  const { jsl, log } = input;

  const ip = getRequestIp(input);

  const nextInput = jsl.addToInput(input, { $IP: ip });
  log.add({ ip });
  Object.assign(nextInput, { ip });

  const response = await this.next(nextInput);
  return response;
};

const getRequestIp = function (input) {
  const { protocolHandler } = input;
  const ip = protocolHandler.getIp(input) || '';

  if (typeof ip !== 'string') {
    const message = `'ip' must be a string, not '${ip}'`;
    throw new EngineError(message, { reason: 'SERVER_INPUT_VALIDATION' });
  }

  return ip;
};

module.exports = {
  getIp,
};
