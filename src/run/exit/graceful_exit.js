'use strict';

const { monitor, logPerfEvent } = require('../../perf');
const { onlyOnce } = require('../../utilities');
const { addErrorHandler } = require('../../errors');
const { logEvent } = require('../../log');

const { closeProtocols } = require('./protocol_close');
const { closeDbAdapters } = require('./db_close');
const { emitStopEvent } = require('./stop_event');

// Close servers and database connections
const mmGracefulExit = async function ({ protocols, dbAdapters, config }) {
  const measures = [];
  const { exit } = await mGracefulExit({
    protocols,
    dbAdapters,
    config,
    measures,
  });

  await emitStopEvent({ exit, config, measures });

  await logPerfEvent({ phase: 'shutdown', measures, config });
};

const oGracefulExit = onlyOnce(mmGracefulExit);

const gracefulExitHandler = async function (error, { config }) {
  const message = 'Shutdown failure';
  await logEvent({
    event: 'failure',
    phase: 'shutdown',
    message,
    params: { error },
    config,
  });
};

const eGracefulExit = addErrorHandler(oGracefulExit, gracefulExitHandler);

const gracefulExit = async function ({
  protocols,
  dbAdapters,
  config,
  measures,
}) {
  const protocolPromises = closeProtocols({ protocols, config, measures });
  const dbPromises = closeDbAdapters({ dbAdapters, config, measures });

  const exitArray = await Promise.all([
    ...protocolPromises,
    ...dbPromises,
  ]);
  const exit = Object.assign({}, ...exitArray);

  return { exit };
};

const mGracefulExit = monitor(gracefulExit, 'all');

module.exports = {
  gracefulExit: eGracefulExit,
};
