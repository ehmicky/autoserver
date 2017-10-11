'use strict';

const { uniq } = require('lodash');

const { monitor, emitPerfEvent } = require('../../perf');
const { assignObject, onlyOnce } = require('../../utilities');

const { closeServer } = require('./server_close');
const { closeDbAdapter } = require('./db_close');
const { emitStopEvent } = require('./stop_event');

// Close servers and database connections
const mmGracefulExit = async function ({ servers, dbAdapters, runOpts }) {
  const measures = [];
  const { statuses } = await mGracefulExit({
    servers,
    dbAdapters,
    runOpts,
    measures,
  });

  await emitStopEvent({ statuses, runOpts, measures });

  await emitPerfEvent({ phase: 'shutdown', measures, runOpts });
};

const oGracefulExit = onlyOnce(mmGracefulExit);

const gracefulExit = async function ({
  servers,
  dbAdapters,
  runOpts,
  measures,
}) {
  const serverPromises = Object.values(servers)
    .map(({ server, protocol }) =>
      closeServer({ server, protocol, runOpts, measures }));

  const adapters = uniq(Object.values(dbAdapters));
  const dbPromises = adapters
    .map(dbAdapter => closeDbAdapter({ dbAdapter, measures }));

  const statusesArray = await Promise.all([...serverPromises, ...dbPromises]);
  const statuses = statusesArray.reduce(assignObject, {});

  return { statuses };
};

const mGracefulExit = monitor(gracefulExit, 'all');

module.exports = {
  gracefulExit: oGracefulExit,
};
