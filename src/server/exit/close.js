'use strict';

const { protocolHandlers } = require('../../protocols');

const { wrapCloseFunc } = require('./wrapper');

// Attempts to close server
// No new connections will be accepted, but we will wait for ongoing ones to end
const closeServer = async function ({ server, protocol, log }) {
  const [, logMeasure] = await monitoredLogClose({ server, protocol, log });
  const [status, stopMeasure] = await monitoredStop({ server, protocol, log });
  const measures = [logMeasure, stopMeasure];

  return [{ protocol, status: Boolean(status) }, measures];
};

// Logs that graceful exit is ongoing, for each protocol
const logClose = async function ({ server, protocol }) {
  const { countPendingRequests } = protocolHandlers[protocol];
  const connectionsCount = await countPendingRequests(server);
  return connectionsCount;
};

const monitoredLogClose = wrapCloseFunc(logClose, {
  label: 'log',
  successMessage: connectionsCount => `Starts shutdown, ${connectionsCount} pending ${connectionsCount === 1 ? 'request' : 'requests'}`,
  errorMessage: 'Failed to count pending pending requests',
});

// Ask each server to stop
const stop = async function ({ server, protocol }) {
  const { stopServer } = protocolHandlers[protocol];
  await stopServer(server);
  return true;
};

const monitoredStop = wrapCloseFunc(stop, {
  label: 'shutdown',
  successMessage: 'Successful shutdown',
  errorMessage: 'Failed to stop server',
});

module.exports = {
  closeServer,
};
