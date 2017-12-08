'use strict';

const { monitor, logPerfEvent } = require('../../perf');
const { uniq, onlyOnce } = require('../../utilities');
const { addErrorHandler } = require('../../error');
const { logEvent } = require('../../log');

const { closeProtocol } = require('./protocol_close');
const { closeDbAdapter } = require('./db_close');
const { emitStopEvent } = require('./stop_event');

// Close servers and database connections
const mmGracefulExit = async function ({ protocols, dbAdapters, schema }) {
  const measures = [];
  const { exitcodes } = await mGracefulExit({
    protocols,
    dbAdapters,
    schema,
    measures,
  });

  await emitStopEvent({ exitcodes, schema, measures });

  await logPerfEvent({ phase: 'shutdown', measures, schema });
};

const oGracefulExit = onlyOnce(mmGracefulExit);

const gracefulExitHandler = async function (error, { schema }) {
  const message = 'Shutdown failure';
  await logEvent({
    event: 'failure',
    phase: 'shutdown',
    message,
    vars: { error },
    schema,
  });
};

const eGracefulExit = addErrorHandler(oGracefulExit, gracefulExitHandler);

const gracefulExit = async function ({
  protocols,
  dbAdapters,
  schema,
  measures,
}) {
  const protocolPromises = Object.values(protocols)
    .map(protocol => closeProtocol({ protocol, schema, measures }));

  // The same `dbAdapter` can be used for several models
  const adapters = uniq(Object.values(dbAdapters));

  const dbPromises = adapters
    .map(dbAdapter => closeDbAdapter({ dbAdapter, schema, measures }));

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
