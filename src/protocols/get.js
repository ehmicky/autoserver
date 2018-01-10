'use strict';

const { protocolAdapters } = require('./wrap');

// Retrieves protocol adapter
const getProtocol = function (protocol) {
  const protocolA = protocolAdapters[protocol];
  if (protocolA !== undefined) { return protocolA.wrapped; }

  const message = `Unsupported protocol: '${protocol}'`;
  // eslint-disable-next-line fp/no-throw
  throw new Error(message);
};

module.exports = {
  getProtocol,
};
