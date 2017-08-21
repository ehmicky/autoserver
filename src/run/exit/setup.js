'use strict';

const { emitEvent } = require('../../events');
const { monitor, emitPerfEvent } = require('../../perf');
const { assignObject, onlyOnce } = require('../../utilities');

const { closeServer } = require('./close');

// Make sure the server stops when graceful exits are possible
// Also send related events
const setupGracefulExit = function ({ servers, runtimeOpts }) {
  const exitHandler = gracefulExit.bind(null, { servers, runtimeOpts });
  const onceExitHandler = onlyOnce(exitHandler);

  process.on('SIGINT', onceExitHandler);
  process.on('SIGTERM', onceExitHandler);
};

// Close servers
const gracefulExit = async function ({ servers, runtimeOpts }) {
  const [childMeasures, measure] = await monitoredSetupExit({
    servers,
    runtimeOpts,
  });

  const measures = [...childMeasures, measure];
  await emitPerfEvent({ phase: 'shutdown', measures, runtimeOpts });
};

const setupExit = async function ({ servers, runtimeOpts }) {
  const statusesPromises = Object.values(servers)
    .map(({ server, protocol }) =>
      closeServer({ server, protocol, runtimeOpts })
    );
  const statusesPromise = await Promise.all(statusesPromises);
  const statuses = statusesPromise
    .map(([{ protocol, status }]) => [protocol, status]);
  const childMeasures = statusesPromise
    .reduce((allMeasures, [, meas]) => [...allMeasures, ...meas], []);

  const { failedProtocols, isSuccess } = processStatuses({ statuses });

  const [, measure] = await monitoredEndEvent({
    statuses,
    failedProtocols,
    isSuccess,
    runtimeOpts,
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

// Emit successful or failed shutdown event
const endEventShutdown = async function ({
  statuses,
  failedProtocols,
  isSuccess,
  runtimeOpts,
}) {
  const message = isSuccess
    ? 'Server exited successfully'
    : `Server exited with errors while shutting down ${failedProtocols}`;
  const level = isSuccess ? 'log' : 'error';
  const exitStatuses = statuses.reduce(assignObject, {});

  await emitEvent({
    type: 'stop',
    phase: 'shutdown',
    level,
    message,
    info: { exitStatuses },
    runtimeOpts,
  });
};

const monitoredEndEvent = monitor(endEventShutdown, 'event');

module.exports = {
  setupGracefulExit,
  gracefulExit,
};
