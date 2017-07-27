'use strict';

const { Log, reportLog, reportPerf } = require('../../logging');
const { monitor } = require('../../perf');
const { assignObject, onlyOnce } = require('../../utilities');

const { closeServer } = require('./close');

// Make sure the server stops when graceful exits are possible
// Also send related logging messages
const setupGracefulExit = function ({
  servers,
  serverOpts,
  apiServer,
}) {
  const exitHandler = gracefulExit.bind(null, {
    servers,
    serverOpts,
    apiServer,
  });

  // Note that this will not work with Nodemon, e.g. CTRL-C will exit
  process.once('SIGINT', exitHandler);
  process.once('SIGTERM', exitHandler);
  // Used by Nodemon
  process.once('SIGUSR2', exitHandler);
  // Make sure servers exit on startup errors
  apiServer.once('startupError', exitHandler);
};

// Setup graceful exit
const gracefulExit = onlyOnce(async ({
  servers,
  serverOpts,
  apiServer,
}) => {
  const log = new Log({ serverOpts, apiServer, phase: 'shutdown' });

  const [[isSuccess, childMeasures], measure] = await monitoredSetupExit({
    servers,
    log,
  });

  const measures = [...childMeasures, measure];
  await reportPerf({ log, measures });

  await exit({ isSuccess, apiServer, log });
});

const setupExit = async function ({ servers, log }) {
  const statusesPromises = Object.values(servers)
    .map(server => closeServer({ server, log }));
  const oStatuses = await Promise.all(statusesPromises);
  const statuses = oStatuses
    .map(([{ protocol, status }]) => [protocol, status]);
  const childMeasures = oStatuses
    .reduce((allMeasures, [, meas]) => [...allMeasures, ...meas], []);

  const { failedProtocols, isSuccess } = processStatuses({ statuses });

  const [, measure] = await monitoredLogEnd({
    log,
    statuses,
    failedProtocols,
    isSuccess,
  });

  const measures = [measure, ...childMeasures];
  return [isSuccess, measures];
};

const monitoredSetupExit = monitor(setupExit, 'all', 'all');

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
  const message = isSuccess
    ? 'Server exited successfully'
    : `Server exited with errors while shutting down ${failedProtocols.join(', ')}`;
  const level = isSuccess ? 'log' : 'error';
  const exitStatuses = statuses.reduce(assignObject, {});

  const type = 'stop';
  await reportLog({ log, level, message, info: { type, exitStatuses } });
};

const monitoredLogEnd = monitor(logEndShutdown, 'log');

// Kills main process, with exit code 0 (success) or 1 (failure)
// This means we consider owning the process, which will be problematic if
// this is used together with other projects
const exit = async function ({ isSuccess, apiServer }) {
  const eventName = isSuccess ? 'stop.success' : 'stop.fail';

  try {
    await apiServer.emitAsync(eventName);
  } catch (error) {}

  // Used by Nodemon
  process.kill(process.pid, 'SIGUSR2');

  const exitCode = isSuccess ? 0 : 1;
  process.exit(exitCode);
};

module.exports = {
  setupGracefulExit,
};
