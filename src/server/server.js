'use strict';


const { resolve } = require('path');

const { Log } = require('../logging');
const { processOptions } = require('../options');
const { startChain } = require('./chain');
const { httpStartServer } = require('./http');
const { setupGracefulExit } = require('./exit');
const { handleStartupError } = require('./error');


// Used e.g. to shorten stack traces
global.apiEngineDirName = resolve(__dirname, '../..');

/**
 * Start server for each protocol, for the moment only HTTP
 *
 * @param {object} options
 * @param {object} options.idl - IDL definitions
 */
const startServer = async function (options = {}) {
  options.startupLog = new Log({ opts: options, phase: 'startup' });

  try {
    return await start(options);
  } catch (error) {
    handleStartupError(options, error);
  }
};

const start = async function (options) {
  const opts = await processOptions(options);
  const { startupLog } = opts;

  // Those two callbacks must be called by each server
  opts.handleRequest = await startChain(opts);
  opts.handleListening = handleListening.bind(null, startupLog);

  // Start each server
  const httpServer = httpStartServer(opts);

  // Make sure all servers are starting concurrently, not serially
  const servers = await Promise.all([httpServer]);
  const [http] = servers;

  startupLog.log('Server is ready', { type: 'start' });

  setupGracefulExit({ servers, opts });

  const serversObj = { http };
  return serversObj;
};

const handleListening = function (startupLog, { protocol, host, port }) {
  const message = `${protocol.toUpperCase()} - Listening on ${host}:${port}`;
  startupLog.log(message);
};


module.exports = {
  startServer,
};
