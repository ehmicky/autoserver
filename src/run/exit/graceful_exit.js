'use strict';

const { monitor, emitPerfEvent } = require('../../perf');
const { uniq, onlyOnce } = require('../../utilities');

const { closeServer } = require('./server_close');
const { closeDbAdapter } = require('./db_close');
const { emitStopEvent } = require('./stop_event');

// Close servers and database connections
const mmGracefulExit = async function ({
  servers,
  dbAdapters,
  runOpts,
  schema,
}) {
  const measures = [];
  const { exitcodes } = await mGracefulExit({
    servers,
    dbAdapters,
    runOpts,
    schema,
    measures,
  });

  await emitStopEvent({ exitcodes, runOpts, schema, measures });

  await emitPerfEvent({ phase: 'shutdown', measures, runOpts, schema });
};

const oGracefulExit = onlyOnce(mmGracefulExit);

const gracefulExit = async function ({
  servers,
  dbAdapters,
  runOpts,
  schema,
  measures,
}) {
  const serverPromises = Object.values(servers)
    .map(server => closeServer({ server, runOpts, schema, measures }));

  // The same `dbAdapter` can be used for several models
  const adapters = uniq(Object.values(dbAdapters));

  const dbPromises = adapters
    .map(dbAdapter => closeDbAdapter({ dbAdapter, runOpts, schema, measures }));

  const exitcodesArray = await Promise.all([...serverPromises, ...dbPromises]);
  const exitcodes = Object.assign({}, ...exitcodesArray);

  return { exitcodes };
};

const mGracefulExit = monitor(gracefulExit, 'all');

module.exports = {
  gracefulExit: oGracefulExit,
};
