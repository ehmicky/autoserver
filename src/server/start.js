'use strict';

const { Log } = require('../logging');
const { monitor, monitoredReduce } = require('../perf');
const { processOptions } = require('../options');
const { getIdl } = require('../idl');

const { ApiEngineServer } = require('./api_server');
const { handleStartupError } = require('./startup_error');
const { processErrorHandler } = require('./process');
const { startServers } = require('./servers');
const { setupGracefulExit } = require('./exit');
const { emitStartEvent } = require('./start_event');

/**
 * Start server for each protocol
 *
 * @param {object} options
 * @param {object} options.idl - IDL definitions
 */
const startServer = function (options = {}) {
  const apiServer = new ApiEngineServer({ serverOpts: options });
  const startupLog = new Log({
    serverOpts: options,
    apiServer,
    phase: 'startup',
  });

  start({ options, startupLog, apiServer })
    .catch(error => handleStartupError({ error, startupLog, apiServer }));

  return apiServer;
};

// Each of the steps performed at startup
const processors = [
  processErrorHandler,
  processOptions,
  getIdl,
  startServers,
  setupGracefulExit,
  emitStartEvent,
];

const start = async function (input) {
  const { startupLog } = input;
  const [childrenPerf, perf] = await monitoredStartAll(input);

  const measures = [perf, ...childrenPerf];
  await startupLog.reportPerf({ measures });
};

const startAll = async function ({ options, startupLog, apiServer }) {
  const initialInput = { options, startupLog, apiServer };
  const [, childrenPerf] = await monitoredReduce({
    funcs: processors,
    initialInput,
    mapResponse: (newInput, input) => Object.assign({}, input, newInput),
  });
  return childrenPerf;
};

const monitoredStartAll = monitor(startAll, 'all', 'all');

module.exports = {
  startServer,
};
