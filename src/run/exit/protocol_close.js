'use strict';

const { wrapCloseFunc } = require('./wrapper');

// Attempts to close server
// No new connections will be accepted, but we will wait for ongoing ones to end
const closeProtocols = function ({ protocolAdapters, config, measures }) {
  return Object.values(protocolAdapters).map(adapter =>
    eCloseProtocol({ type: 'protocols', adapter, config, measures }));
};

const closeProtocol = function ({ adapter: { stopServer } }) {
  return stopServer();
};

const eCloseProtocol = wrapCloseFunc(closeProtocol);

module.exports = {
  closeProtocols,
};
