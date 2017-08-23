'use strict';

const { throwError } = require('../../error');

const getProtocolName = function ({ specific, protocolHandler }) {
  const protocolFullName = protocolHandler.getFullName({ specific });

  if (typeof protocolFullName !== 'string') {
    const message = `'protocolFullName' must be a string, not ${protocolFullName}`;
    throwError(message, { reason: 'SERVER_INPUT_VALIDATION' });
  }

  return { protocolFullName };
};

module.exports = {
  getProtocolName,
};
