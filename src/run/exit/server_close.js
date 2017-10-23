'use strict';

const { wrapCloseFunc } = require('./wrapper');

// Attempts to close server
// No new connections will be accepted, but we will wait for ongoing ones to end
const closeServer = async function ({
  server,
  server: {
    protocolHandler: { name, title },
  },
  runOpts,
  measures,
}) {
  const opts = { server, name, title, runOpts, measures };
  await mEventClose(opts);
  const status = await mStop(opts);

  return { [name]: Boolean(status) };
};

// Emit event that graceful exit is ongoing, for each protocol
const eventClose = function ({
  server: {
    server,
    protocolHandler: { countPendingRequests },
  },
}) {
  return countPendingRequests(server);
};

const mEventClose = wrapCloseFunc(eventClose, {
  label: 'event',
  successMessage: connectionsCount => `Starts shutdown, ${connectionsCount} pending ${connectionsCount === 1 ? 'request' : 'requests'}`,
  errorMessage: 'Failed to count pending pending requests',
  reason: 'PROTOCOL_ERROR',
});

// Ask each server to stop
const stop = async function ({
  server: {
    server,
    protocolHandler: { stopServer },
  },
}) {
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
