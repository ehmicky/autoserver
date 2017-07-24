'use strict';

const { getStandardError } = require('../error');
const { protocolHandlers } = require('../protocols');

// Attempts to close server
// No new connections will be accepted, but we will wait for ongoing ones to end
const closeServer = async function ({ server, server: { protocol }, log }) {
  await logStartShutdown({ server, log, protocol });

  const status = Boolean(await shutdownServer({ server, log, protocol }));

  return [protocol, status];
};

// Logs that graceful exit is ongoing, for each protocol
const logStartShutdown = async function ({ server, log, protocol }) {
  try {
    const perf = log.perf.start(`${protocol}.init`);

    const { countPendingRequests } = protocolHandlers[protocol];
    const connectionsCount = await countPendingRequests(server);
    const message = `${protocol} - Starts shutdown, ${connectionsCount} pending ${connectionsCount === 1 ? 'request' : 'requests'}`;
    await log.log(message);

    perf.stop();
  } catch (error) {
    const errorMessage = `${protocol} - Failed to count pending pending requests`;
    await handleError({ log, error, errorMessage });
  }
};

// Ask each server to close
const shutdownServer = async function ({ server, log, protocol }) {
  try {
    const perf = log.perf.start(`${protocol}.shutdown`);

    const { stopServer } = protocolHandlers[protocol];
    await stopServer(server);
    // Logs that graceful exit is done, for each protocol
    const message = `${protocol} - Successful shutdown`;
    await log.log(message);

    perf.stop();
    return true;
  } catch (error) {
    const errorMessage = `${protocol} - Failed to stop server`;
    await handleError({ log, error, errorMessage });
  }
};

// Log shutdown failures
const handleError = async function ({ log, error, errorMessage }) {
  const errorInfo = getStandardError({ log, error });
  await log.error(errorMessage, { type: 'failure', errorInfo });
};

module.exports = {
  closeServer,
};
