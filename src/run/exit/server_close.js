'use strict';

const { protocolHandlers } = require('../../protocols');

const { wrapCloseFunc } = require('./wrapper');

// Attempts to close server
// No new connections will be accepted, but we will wait for ongoing ones to end
const closeServer = async function ({ server, protocol, runOpts, measures }) {
  await mEventClose({ server, protocol, runOpts, measures });
  const status = await mStop({ server, protocol, runOpts, measures });

  return { [protocol]: Boolean(status) };
};

// Emit event that graceful exit is ongoing, for each protocol
const eventClose = function ({ server, protocol }) {
  const { countPendingRequests } = protocolHandlers[protocol];
  return countPendingRequests(server);
};

const mEventClose = wrapCloseFunc(eventClose, {
  label: 'event',
  successMessage: connectionsCount => `Starts shutdown, ${connectionsCount} pending ${connectionsCount === 1 ? 'request' : 'requests'}`,
  errorMessage: 'Failed to count pending pending requests',
  reason: 'PROTOCOL_ERROR',
});

// Ask each server to stop
const stop = async function ({ server, protocol }) {
  const { stopServer } = protocolHandlers[protocol];
  await stopServer(server);
  return true;
};

const mStop = wrapCloseFunc(stop, {
  label: 'shutdown',
  successMessage: 'Successful shutdown',
  errorMessage: 'Failed to stop server',
  reason: 'PROTOCOL_ERROR',
});

module.exports = {
  closeServer,
};
