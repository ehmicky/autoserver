'use strict';

const { reduceAsync } = require('../utilities');
const { Log } = require('../logging');
const { processOptions } = require('../options');
const { getIdl } = require('../idl');

const { ApiEngineServer } = require('./api_server');
const { handleStartupError } = require('./startup_error');
const { processErrorHandler } = require('./process');
const { startAllServers } = require('./servers');
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
  startAllServers,
  setupGracefulExit,
  emitStartEvent,
];

const start = async function ({ options, startupLog, apiServer }) {
  const allPerf = startupLog.perf.start('all', 'all');

  await reduceAsync(processors, async (input, processor) => {
    const perf = startupLog.perf.start(processor.name);
    const nextInput = await processor(input);
    perf.stop();
    return Object.assign({}, input, nextInput);
  }, { options, startupLog, apiServer });

  allPerf.stop();
  await startupLog.perf.report();
};

module.exports = {
  startServer,
};
