'use strict';

const { createLog, reportLog, reportPerf } = require('../../logging');
const { monitor } = require('../../perf');
const { assignObject, onlyOnce } = require('../../utilities');
const { emitEventAsync } = require('../../events');

const { closeServer } = require('./close');

// Make sure the server stops when graceful exits are possible
// Also send related logging messages
const setupGracefulExit = function ({ servers, serverOpts, apiServer }) {
  const exitHandler = gracefulExit.bind(null, {
    servers,
    serverOpts,
    apiServer,
  });
  const onceExitHandler = onlyOnce(exitHandler);

  process.on('SIGINT', onceExitHandler);
  process.on('SIGTERM', onceExitHandler);
  // Make sure servers exit on startup errors
  apiServer.on('startupError', onceExitHandler);
};

// Setup graceful exit
const gracefulExit = async ({ servers, serverOpts, apiServer }) => {
  const log = createLog({ serverOpts, apiServer, phase: 'shutdown' });

  const [[isSuccess, childMeasures], measure] = await monitoredSetupExit({
    servers,
    log,
  });

  const measures = [...childMeasures, measure];
  await reportPerf({ log, measures });

  await emitStopEvent({ isSuccess, apiServer });
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
    : `Server exited with errors while shutting down ${failedProtocols}`;
  const level = isSuccess ? 'log' : 'error';
  const exitStatuses = statuses.reduce(assignObject, {});

  const type = 'stop';
  await reportLog({ log, level, message, info: { type, exitStatuses } });
};

const monitoredLogEnd = monitor(logEndShutdown, 'log');

const emitStopEvent = async function ({ isSuccess, apiServer }) {
  try {
    const name = isSuccess ? 'stop.success' : 'stop.fail';
    await emitEventAsync({ apiServer, name });
  } catch (error) {}
};

module.exports = {
  setupGracefulExit,
};
