'use strict';


const { Log } = require('../logging');
const { getStandardError } = require('../error');
const { assignObject, onlyOnce } = require('../utilities');


// Make sure the server stops when graceful exits are possible
// Also send related logging messages
const setupGracefulExit = function ({
  servers,
  serverOpts,
  serverOpts: { apiServer },
}) {
  const exit = gracefulExit.bind(null, { servers, serverOpts });

  // Note that this will not work with Nodemon, e.g. CTRL-C will exit
  process.once('SIGINT', exit);
  process.once('SIGTERM', exit);
  // Used by Nodemon
  process.once('SIGUSR2', exit);
  // Make sure servers exit on startup errors
  apiServer.once('startupError', exit);
};

// Setup graceful exit
const gracefulExit = onlyOnce(async function ({
  servers,
  serverOpts,
  serverOpts: { apiServer },
}) {
  const log = new Log({ serverOpts, phase: 'shutdown' });
  const perf = log.perf.start('all', 'all');

  const closingServers = Object.values(servers)
    .map(server => closeServer({ server, log }));
  const statuses = await Promise.all(closingServers);

  const { failedProtocols, isSuccess } = processStatuses({ statuses });

  await logEndShutdown({ log, statuses, failedProtocols, isSuccess });

  perf.stop();
  await log.perf.report();

  await exit({ isSuccess, apiServer, log });
});

// Attempts to close server
// No new connections will be accepted, but we will wait for ongoing ones to end
const closeServer = async function ({ server, log }) {
  const { protocolName: protocol } = server;

  await logStartShutdown({ server, log, protocol });

  const status = Boolean(await shutdownServer({ server, log, protocol }));

  return [protocol, status];
};

// Logs that graceful exit is ongoing, for each protocol
const logStartShutdown = async function ({ server, log, protocol }) {
  try {
    const perf = log.perf.start(`${protocol}.init`);

    const connectionsCount = await server.countPendingRequests();
    const message = `${protocol} - Starts shutdown, ${connectionsCount} pending ${connectionsCount === 1 ? 'request' : 'requests'}`;
    await log.log(message);

    perf.stop();
  } catch (error) {
    const perf = log.perf.start(`${protocol}.init`, 'exception');

    const errorMessage = `${protocol} - Failed to count pending pending requests`;
    await handleError({ log, error, errorMessage });

    perf.stop();
  }
};

// Ask each server to close
const shutdownServer = async function ({ server, log, protocol }) {
  try {
    const perf = log.perf.start(`${protocol}.shutdown`);

    await server.stop();
    // Logs that graceful exit is done, for each protocol
    const message = `${protocol} - Successful shutdown`;
    await log.log(message);

    perf.stop();
    return true;
  } catch (error) {
    const perf = log.perf.start(`${protocol}.shutdown`, 'exception');

    const errorMessage = `${protocol} - Failed to stop server`;
    await handleError({ log, error, errorMessage });

    perf.stop();
  }
};

// Log shutdown failures
const handleError = async function ({ log, error, errorMessage }) {
  const errorInfo = getStandardError({ log, error });
  await log.error(errorMessage, { type: 'failure', errorInfo });
};

// Retrieves which servers exits have failed, if any
const processStatuses = function ({ statuses }) {
  const failedProtocols = statuses
    .filter(([, status]) => !status)
    .map(([protocol]) => protocol);
  const isSuccess = failedProtocols.length === 0;

  return { failedProtocols, isSuccess };
};

// Log successful or failed shutdown
const logEndShutdown = async function ({
  log,
  statuses,
  failedProtocols,
  isSuccess,
}) {
  const perf = log.perf.start('log');

  const message = isSuccess
    ? 'Server exited successfully'
    : `Server exited with errors while shutting down ${failedProtocols.join(', ')}`;
  const level = isSuccess ? 'log' : 'error';
  const exitStatuses = statuses.reduce(assignObject, {});

  await log[level](message, { type: 'stop', exitStatuses });

  perf.stop();
};

// Kills main process, with exit code 0 (success) or 1 (failure)
// This means we consider owning the process, which will be problematic if
// this is used together with other projects
const exit = async function ({ isSuccess, apiServer }) {
  const eventName = isSuccess ? 'stop.success' : 'stop.fail';
  try {
    await apiServer.emitAsync(eventName);
  } catch (error) {/* */}

  // Used by Nodemon
  process.kill(process.pid, 'SIGUSR2');

  const exitCode = isSuccess ? 0 : 1;
  process.exit(exitCode);
};


module.exports = {
  setupGracefulExit,
};
