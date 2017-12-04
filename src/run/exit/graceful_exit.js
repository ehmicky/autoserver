'use strict';

const { monitor, emitPerfEvent } = require('../../perf');
const { uniq, onlyOnce } = require('../../utilities');
const { addErrorHandler } = require('../../error');
const { emitEvent } = require('../../events');

const { closeProtocol } = require('./protocol_close');
const { closeDbAdapter } = require('./db_close');
const { emitStopEvent } = require('./stop_event');

// Close servers and database connections
const mmGracefulExit = async function ({
  protocols,
  dbAdapters,
  runOpts,
  schema,
}) {
  const measures = [];
  const { exitcodes } = await mGracefulExit({
    protocols,
    dbAdapters,
    runOpts,
    schema,
    measures,
  });

  await emitStopEvent({ exitcodes, runOpts, schema, measures });

  await emitPerfEvent({ phase: 'shutdown', measures, runOpts, schema });
};

const oGracefulExit = onlyOnce(mmGracefulExit);

const gracefulExitHandler = async function (error, { runOpts, schema }) {
  const message = 'Shutdown failure';
  await emitEvent({
    type: 'failure',
    phase: 'shutdown',
    message,
    error,
    runOpts,
    schema,
  });
};

const eGracefulExit = addErrorHandler(oGracefulExit, gracefulExitHandler);

const gracefulExit = async function ({
  protocols,
  dbAdapters,
  runOpts,
  schema,
  measures,
}) {
  const protocolPromises = Object.values(protocols)
    .map(protocol => closeProtocol({ protocol, runOpts, schema, measures }));

  // The same `dbAdapter` can be used for several models
  const adapters = uniq(Object.values(dbAdapters));

  const dbPromises = adapters
    .map(dbAdapter => closeDbAdapter({ dbAdapter, runOpts, schema, measures }));

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
