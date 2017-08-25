'use strict';

const { monitor, emitPerfEvent } = require('../../perf');
const { assignObject } = require('../../utilities');

const { closeServer } = require('./close');
const { emitStopEvent } = require('./stop_event');

// Close servers
const mmGracefulExit = async function ({ servers, runOpts }) {
  const measures = [];
  const { statuses } = await mGracefulExit({ servers, runOpts, measures });

  await emitStopEvent({ statuses, runOpts, measures });

  await emitPerfEvent({ phase: 'shutdown', measures, runOpts });
};

const gracefulExit = async function ({ servers, runOpts, measures }) {
  const statusesPromises = Object.values(servers)
    .map(({ server, protocol }) =>
      closeServer({ server, protocol, runOpts, measures })
    );
  const statusesArray = await Promise.all(statusesPromises);
  const statuses = statusesArray.reduce(assignObject, {});

  return { statuses };
};

const mGracefulExit = monitor(gracefulExit, 'all');

module.exports = {
  gracefulExit: mmGracefulExit,
};
