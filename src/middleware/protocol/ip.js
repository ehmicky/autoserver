'use strict';

const { throwError } = require('../../error');

// Retrieve request's IP, assigned to protocol input,
// and also to IDL function variable $IP
const getIp = function (input) {
  const ip = getRequestIp(input);

  return {
    ip,
    reqInfo: { ip },
    ifvParams: { $IP: ip },
  };
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
