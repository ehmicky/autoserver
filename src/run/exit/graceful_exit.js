'use strict';

const { monitor, logPerfEvent } = require('../../perf');
const { uniq, onlyOnce } = require('../../utilities');
const { addErrorHandler } = require('../../error');
const { logEvent } = require('../../log');

const { closeProtocol } = require('./protocol_close');
const { closeDbAdapter } = require('./db_close');
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
  const protocolPromises = Object.values(protocols)
    .map(protocol => closeProtocol({ protocol, config, measures }));

  // The same `dbAdapter` can be used for several models
  const adapters = uniq(Object.values(dbAdapters));

  const dbPromises = adapters
    .map(dbAdapter => closeDbAdapter({ dbAdapter, config, measures }));

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
