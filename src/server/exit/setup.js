'use strict';

const { createLog, reportLog, reportPerf } = require('../../logging');
const { monitor } = require('../../perf');
const { assignObject, onlyOnce } = require('../../utilities');

const { closeServer } = require('./close');

// Make sure the server stops when graceful exits are possible
// Also send related logging messages
const setupGracefulExit = function ({ servers, runtimeOpts, apiServer }) {
  const exitHandler = gracefulExit.bind(null, {
    servers,
    runtimeOpts,
    apiServer,
  });
  const onceExitHandler = onlyOnce(exitHandler);

  process.on('SIGINT', onceExitHandler);
  process.on('SIGTERM', onceExitHandler);

  // Make sure servers exit on startup errors
  // eslint-disable-next-line fp/no-mutation, no-param-reassign
  apiServer.exit = onceExitHandler;
};

// Setup graceful exit
const gracefulExit = async ({ servers, runtimeOpts, apiServer }) => {
  const log = createLog({ runtimeOpts, apiServer, phase: 'shutdown' });

  const [childMeasures, measure] = await monitoredSetupExit({ servers, log });

  const measures = [...childMeasures, measure];
  await reportPerf({ log, measures });
};

const setupExit = async function ({ servers, log }) {
  const statusesPromises = Object.values(servers)
    .map(({ server, protocol }) => closeServer({ server, protocol, log }));
  const statusesPromise = await Promise.all(statusesPromises);
  const statuses = statusesPromise
    .map(([{ protocol, status }]) => [protocol, status]);
  const childMeasures = statusesPromise
    .reduce((allMeasures, [, meas]) => [...allMeasures, ...meas], []);

  const { failedProtocols, isSuccess } = processStatuses({ statuses });

  const [, measure] = await monitoredLogEnd({
    log,
    statuses,
    failedProtocols,
    isSuccess,
  });

  return [measure, ...childMeasures];
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
    : `Server exited with errors while shutting down ${failedProtocols}`;
  const level = isSuccess ? 'log' : 'error';
  const exitStatuses = statuses.reduce(assignObject, {});

  const info = { exitStatuses };
  await reportLog({ log, type: 'stop', level, message, info });
};

const monitoredLogEnd = monitor(logEndShutdown, 'log');

module.exports = {
  setupGracefulExit,
};
