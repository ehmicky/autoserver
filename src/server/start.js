'use strict';


const { resolve } = require('path');
const { cloneDeep } = require('lodash');

const { Log } = require('../logging');
const { processErrorHandler } = require('./process');
const { processOptions } = require('../options');
const { ApiEngineServer } = require('./server');
const { startChain } = require('./chain');
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
  const server = new ApiEngineServer();
  const startupLog = new Log({ opts: options, phase: 'startup' });

  start(options, server, startupLog)
  .catch(error => {
    handleStartupError(options, server, error);
  });

  return options.server;
};

const start = async function (options, server, startupLog) {
  const originalOptions = cloneDeep(options);

  const processLog = processErrorHandler({ opts: options });
  Object.assign(options, { server, startupLog, processLog });

  const opts = await processOptions(options);

  // Those two callbacks must be called by each server
  opts.handleRequest = await startChain(opts);
  opts.handleListening = handleListening.bind(null, startupLog);

  // Start each server
  const httpServer = httpStartServer(opts);

  // Make sure all servers are starting concurrently, not serially
  const serversArray = await Promise.all([httpServer]);
  const [http] = serversArray;

  const servers = { http };
  Object.assign(server, { servers, options: originalOptions });

  setupGracefulExit({ servers: serversArray, opts });

  // Create log message when all protocol-specific servers have started
  startupLog.log('Server is ready', { type: 'start' });
  server.emit('start');
};

// Create log message when each protocol-specific server starts
const handleListening = function (startupLog, { protocol, host, port }) {
  const message = `${protocol.toUpperCase()} - Listening on ${host}:${port}`;
  startupLog.log(message);
};


module.exports = {
  startServer,
};
