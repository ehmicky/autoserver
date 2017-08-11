'use strict';

const { protocolHandlers } = require('../../protocols');

const { wrapCloseFunc } = require('./wrapper');

// Attempts to close server
// No new connections will be accepted, but we will wait for ongoing ones to end
const closeServer = async function ({ server, protocol, runtimeOpts }) {
  const [, eventMeasure] = await monitoredEventClose({
    server,
    protocol,
    runtimeOpts,
  });
  const [status, stopMeasure] = await monitoredStop({
    server,
    protocol,
    runtimeOpts,
  });
  const measures = [eventMeasure, stopMeasure];

  return [{ protocol, status: Boolean(status) }, measures];
};

// Emit event that graceful exit is ongoing, for each protocol
const eventClose = async function ({ server, protocol }) {
  const { countPendingRequests } = protocolHandlers[protocol];
  const connectionsCount = await countPendingRequests(server);
  return connectionsCount;
};

const monitoredEventClose = wrapCloseFunc(eventClose, {
  label: 'event',
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
