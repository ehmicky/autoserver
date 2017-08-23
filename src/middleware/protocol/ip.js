'use strict';

const { throwError } = require('../../error');

// Retrieve request's IP, assigned to protocol input,
// and also to IDL function variable $IP
const getIp = function ({ protocolHandler, specific }) {
  const ip = getRequestIp({ protocolHandler, specific });

  return {
    ip,
    ifvParams: { $IP: ip },
  };
};

const getRequestIp = function ({ protocolHandler, specific }) {
  const ip = protocolHandler.getIp({ specific }) || '';

  if (typeof ip !== 'string') {
    const message = `'ip' must be a string, not '${ip}'`;
    throwError(message, { reason: 'SERVER_INPUT_VALIDATION' });
  }

  return ip;
};

module.exports = {
  getIp,
};
