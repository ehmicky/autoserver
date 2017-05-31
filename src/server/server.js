'use strict';


const { getLog } = require('../logging');
const { processOptions } = require('../options');
const { startChain } = require('./chain');
const { httpStartServer } = require('./http');
const { handleStartupError } = require('./error');


/**
 * Start server for each protocol, for the moment only HTTP
 *
 * @param {object} options
 * @param {object} options.idl - IDL definitions
 */
const startServer = async function (options) {
  try {
    return await start(options);
  } catch (error) {
    handleStartupError(error);
  }
};

const start = async function (options) {
  const opts = await processOptions(options);

  setLog(opts);

  // Those two callbacks must be called by each server
  opts.handleRequest = await startChain(opts);
  opts.handleListening = handleListening.bind(null, opts.log);

  // Start each server
  const httpServer = httpStartServer(opts);

  // Make sure all servers are starting concurrently, not serially
  const [http] = await Promise.all([httpServer]);
  const servers = { http };
  return servers;
};

// Sets `opts.log` logging utility
const setLog = function (opts) {
  opts.log = getLog({ logger: opts.logger });
  delete opts.logger;
};

const handleListening = function (log, { protocol, host, port }) {
  const message = `${protocol.toUpperCase()} - Listening on ${host}:${port}`;
  log.log(message, { type: 'startup' });
};


module.exports = {
  startServer,
};
