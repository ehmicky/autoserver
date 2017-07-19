'use strict';

const { EngineError } = require('../../error');

// Retrieve request's IP, assigned to protocol input, and also to JSL $IP
const getIp = async function (input) {
  const { jsl, log, protocolHandler } = input;

  const ip = protocolHandler.getIp(input) || '';

  if (typeof ip !== 'string') {
    const message = `'ip' must be a string, not '${ip}'`;
    throw new EngineError(message, { reason: 'SERVER_INPUT_VALIDATION' });
  }

  const newJsl = jsl.add({ $IP: ip });
  log.add({ ip });

  Object.assign(input, { ip, jsl: newJsl });

  const response = await this.next(input);
  return response;
};

module.exports = {
  getIp,
};
