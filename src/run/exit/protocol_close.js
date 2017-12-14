'use strict';

const { wrapCloseFunc } = require('./wrapper');

// Attempts to close server
// No new connections will be accepted, but we will wait for ongoing ones to end
const closeProtocols = function ({ protocols, config, measures }) {
  const protocolsA = Object.values(protocols);

  return protocolsA.map(({ server, protocolAdapter: adapter }) =>
    eCloseProtocol({ type: 'protocols', server, adapter, config, measures }));
};

const closeProtocol = function ({ server, adapter: { stopServer } }) {
  return stopServer(server);
};

const eCloseProtocol = wrapCloseFunc(closeProtocol);

module.exports = {
  closeProtocols,
};
