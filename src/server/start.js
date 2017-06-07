'use strict';


const { resolve } = require('path');
const { cloneDeep } = require('lodash');

const { Log } = require('../logging');
const { processErrorHandler } = require('./process');
const { processOptions } = require('../options');
const { ApiEngineServer } = require('./api_server');
const { getMiddleware } = require('./middleware');
const { httpStartServer } = require('./http');
const { setupGracefulExit } = require('./exit');
const { handleStartupError } = require('./startup_error');


// Used e.g. to shorten stack traces
global.apiEngineDirName = resolve(__dirname, '../..');

/**
 * Start server for each protocol, for the moment only HTTP
 *
 * @param {object} options
 * @param {object} options.idl - IDL definitions
 */
const startServer = function (options = {}) {
  const apiServer = new ApiEngineServer();
  const startupLog = new Log({ opts: options, phase: 'startup' });

  start(options, apiServer, startupLog)
  .catch(error => handleStartupError(options, apiServer, error));

  return apiServer;
};

const start = async function (options, apiServer, startupLog) {
  const allPerf = startupLog.perf.start('all', 'all');
  const perf = startupLog.perf.start('main');

  const originalOptions = cloneDeep(options);

  const processLog = processErrorHandler({ opts: options });
  // Assign them to `options` so they are easily available anywhere
  Object.assign(options, { apiServer, startupLog, processLog });

  perf.stop();
  const opts = await processOptions(options);

  // Those two callbacks must be called by each server
  opts.handleRequest = await getMiddleware(opts);

  const serversPerf = startupLog.perf.start('servers');
  opts.handleListening = handleListening.bind(null, startupLog);

  // Start each server
  const httpPerf = startupLog.perf.start('HTTP', 'server');
  const httpServer = httpStartServer(opts);
  httpServer.then(() => httpPerf.stop());

  // Make sure all servers are starting concurrently, not serially
  const serversArray = await Promise.all([httpServer]);
  const [http] = serversArray;
  serversPerf.stop();
  perf.start();

  const servers = { http };
  Object.assign(apiServer, { servers, options: originalOptions });

  setupGracefulExit({ servers: serversArray, opts });

  // Create log message when all protocol-specific servers have started
  startupLog.log('Server is ready', { type: 'start' });
  await apiServer.emitAsync('start');

  perf.stop();
  allPerf.stop();
  startupLog.perf.report();
};

// Create log message when each protocol-specific server starts
const handleListening = function (startupLog, { protocol, host, port }) {
  const message = `${protocol.toUpperCase()} - Listening on ${host}:${port}`;
  startupLog.log(message);
};


module.exports = {
  startServer,
};
