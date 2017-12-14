'use strict';

const { monitor, logPerfEvent } = require('../../perf');
const { onlyOnce } = require('../../utilities');
const { addErrorHandler } = require('../../error');
const { logEvent } = require('../../log');

const { closeProtocols } = require('./protocol_close');
const { closeDbAdapters } = require('./db_close');
const { emitStopEvent } = require('./stop_event');

// Close servers and database connections
const mmGracefulExit = async function ({ protocols, dbAdapters, config }) {
  const measures = [];
  const { exitcodes } = await mGracefulExit({
    protocols,
    dbAdapters,
    config,
    measures,
  });

  await emitStopEvent({ exitcodes, config, measures });

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

  const exitcodesArray = await Promise.all([
    ...protocolPromises,
    ...dbPromises,
  ]);
  const exitcodes = Object.assign({}, ...exitcodesArray);

  return { exitcodes };
};

const mGracefulExit = monitor(gracefulExit, 'all');

module.exports = {
  gracefulExit: eGracefulExit,
};
