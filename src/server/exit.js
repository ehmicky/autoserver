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

// Setup graceful exit
const gracefulExit = onlyOnce(async function ({ servers, opts }) {
  const { apiServer } = opts;
  const log = new Log({ opts, phase: 'shutdown' });
  const perf = log.perf.start('all');

  perf.stop();
  const closingServers = servers.map(server => closeServer({ server, log }));
  const statuses = await Promise.all(closingServers);
  perf.start();

  const { failedProtocols, isSuccess } = processStatuses({ statuses });

  logEndShutdown({ log, statuses, failedProtocols, isSuccess });

  perf.stop();
  log.perf.report();

  exit({ isSuccess, apiServer, log });
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
    log.log(message);

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
    log.log(message);

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
  log.error(errorMessage, { type: 'failure', errorInfo });
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
const logEndShutdown = function ({
  log,
  statuses,
  failedProtocols,
  isSuccess,
}) {
  const message = isSuccess
    ? 'Server exited successfully'
    : `Server exited with errors while shutting down ${failedProtocols.join(', ')}`;
  const level = isSuccess ? 'log' : 'error';
  const exitStatuses = statuses.reduce((memo, [protocol, status]) => {
    return Object.assign(memo, { [protocol]: status });
  }, {});

  log[level](message, { type: 'stop', exitStatuses });
};

// Kills main process, with exit code 0 (success) or 1 (failure)
// This means we consider owning the process, which will be problematic if
// this is used together with other projects
const exit = function ({ isSuccess, apiServer }) {
  const eventName = isSuccess ? 'stop.success' : 'stop.fail';
  apiServer.emit(eventName);

  // Used by Nodemon
  process.kill(process.pid, 'SIGUSR2');

  const exitCode = isSuccess ? 0 : 1;
  process.exit(exitCode);
};


module.exports = {
  setupGracefulExit,
};
