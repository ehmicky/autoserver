'use strict';


const { Log } = require('../logging');
const { getStandardError } = require('../error');
const { onlyOnce } = require('../utilities');


// Make sure the server stops when graceful exits are possible
// Also send related logging messages
const setupGracefulExit = function ({ servers, opts }) {
  // Note that this will not work with Nodemon, e.g. CTRL-C will exit
  process.once('SIGINT', gracefulExit.bind(null, { servers, opts }));
  process.once('SIGTERM', gracefulExit.bind(null, { servers, opts }));
  // Used by Nodemon
  process.once('SIGUSR2', gracefulExit.bind(null, { servers, opts }));
};

const gracefulExit = onlyOnce(async function ({ servers, opts }) {
  const log = new Log({ opts, phase: 'shutdown' });

  const closingServers = servers.map(server => closeServer({ server, log }));
  const statuses = await Promise.all(closingServers);

  logEndShutdown({ log, statuses });

  // Used by Nodemon
  process.kill(process.pid, 'SIGUSR2');
});

// Log successful or failed shutdown
const logEndShutdown = function ({ log, statuses }) {
  const exitStatuses = statuses.reduce((memo, status) => {
    return Object.assign(memo, status);
  }, {});
  const failedProtocols = Object.entries(exitStatuses)
    .filter(([, status]) => status !== 'success')
    .map(([protocol]) => protocol);
  const isSuccess = failedProtocols.length === 0;

  const message = isSuccess
    ? 'Server exited successfully'
    : `Server exited with errors while shutting down ${failedProtocols.join(', ')}`;
  const level = isSuccess ? 'log' : 'error';

  log[level](message, { type: 'stop', exitStatuses });
};


// Attempts to close server
// No new connections will be accepted, but we will wait for ongoing ones to end
const closeServer = async function ({ server, log }) {
  const { protocolName: protocol } = server;

  await logStartShutdown({ server, log, protocol });

  let status = await shutdownServer({ server, log, protocol });
  status = status || 'failure';

  return { [protocol]: status };
};

const logStartShutdown = async function ({ server, log, protocol }) {
  try {
    const connectionsCount = await server.countPendingRequests();
    const message = `${protocol} - Starts shutdown, ${connectionsCount} pending ${connectionsCount === 1 ? 'request' : 'requests'}`;
    log.log(message);
  } catch (error) {
    const errorMessage = `${protocol} - Failed to count pending pending requests`;
    await handleError({ log, error, errorMessage, server });
  }
};

const shutdownServer = async function ({ server, log, protocol }) {
  try {
    await server.stop();
    const message = `${protocol} - Successful shutdown`;
    log.log(message);
    return 'success';
  } catch (error) {
    const errorMessage = `${protocol} - Failed to stop server`;
    await handleError({ log, error, errorMessage, server });
  }
};

// Log shutdown failures
const handleError = async function ({ log, error, errorMessage, server }) {
  const errorInfo = getStandardError({ log, error });
  log.error(errorMessage, { type: 'failure', errorInfo });
  // Force kill the server
  await server.kill();
};


module.exports = {
  setupGracefulExit,
};
