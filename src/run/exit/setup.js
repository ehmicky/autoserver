'use strict';

const { emitEvent } = require('../../events');
const { monitor, emitPerfEvent } = require('../../perf');
const { onlyOnce, pickBy, assignObject } = require('../../utilities');

const { closeServer } = require('./close');

// Make sure the server stops when graceful exits are possible
// Also send related events
const setupGracefulExit = function ({ servers, runOpts }) {
  const exitHandler = mmGracefulExit.bind(null, { servers, runOpts });
  const onceExitHandler = onlyOnce(exitHandler);

  process.on('SIGINT', onceExitHandler);
  process.on('SIGTERM', onceExitHandler);
};

// Close servers
const mmGracefulExit = async function ({ servers, runOpts }) {
  const measures = [];
  await mGracefulExit({ servers, runOpts, measures });

  await emitPerfEvent({ phase: 'shutdown', measures, runOpts });
};

const gracefulExit = async function ({ servers, runOpts, measures }) {
  const statusesPromises = Object.values(servers)
    .map(({ server, protocol }) =>
      closeServer({ server, protocol, runOpts, measures })
    );
  const statusesArray = await Promise.all(statusesPromises);
  const statuses = statusesArray.reduce(assignObject, {});

  await mEmitStopEvent({ statuses, runOpts, measures });
};

const mGracefulExit = monitor(gracefulExit, 'all');

// Emit successful or failed shutdown event
const emitStopEvent = async function ({ statuses, runOpts }) {
  const failedProtocols = getFailedProtocols({ statuses });

  const isSuccess = failedProtocols.length === 0;
  const message = isSuccess
    ? 'Server exited successfully'
    : `Server exited with errors while shutting down ${failedProtocols}`;
  const level = isSuccess ? 'log' : 'error';

  await emitEvent({
    type: 'stop',
    phase: 'shutdown',
    level,
    message,
    info: { exitStatuses: statuses },
    runOpts,
  });
};

const mEmitStopEvent = monitor(emitStopEvent, 'event', 'main');

// Retrieves which servers exits have failed, if any
const getFailedProtocols = function ({ statuses }) {
  const failedStatuses = pickBy(statuses, status => !status);
  const failedProtocols = Object.keys(failedStatuses);
  return failedProtocols;
};

module.exports = {
  setupGracefulExit,
  gracefulExit: mmGracefulExit,
};
