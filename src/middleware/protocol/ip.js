'use strict';

const { throwError } = require('../../errors');

// Retrieve request's IP, assigned to protocol mInput,
// and also to parameter `ip`
const getIp = function ({ protocolAdapter, specific }) {
  const ip = protocolAdapter.getIp({ specific }) || '';

  if (typeof ip !== 'string') {
    const message = `'ip' must be a string, not '${ip}'`;
    throwError(message, { reason: 'PROTOCOL' });
  }

  return { ip };
};

module.exports = {
  getIp,
};
