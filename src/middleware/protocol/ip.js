'use strict';

const { throwError } = require('../../error');

// Retrieve request's IP, assigned to protocol mInput,
// and also to schema function variable ip
const getIp = function ({ protocolAdapter, specific }) {
  const ip = protocolAdapter.getIp({ specific }) || '';

  if (typeof ip !== 'string') {
    const message = `'ip' must be a string, not '${ip}'`;
    throwError(message, { reason: 'SERVER_INPUT_VALIDATION' });
  }

  return { ip };
};

module.exports = {
  getIp,
};
