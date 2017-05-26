'use strict';


const { EngineStartupError } = require('../error');
const { setLogger } = require('../utilities');
const { processOptions } = require('../options');
const { startChain } = require('./chain');
const { httpStartServer } = require('./http');


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
    // Make sure all exceptions thrown at startup follow
    // the EngineStartupError signature
    if (typeof error === 'string') {
      error = new EngineStartupError(error, { reason: 'UNKNOWN' });
    } else if (!(error instanceof EngineStartupError)) {
      error = new EngineStartupError(error.message, {
        reason: error.reason || 'UNKNOWN',
        innererror: error,
      });
    }

    error.normalize();

    throw error;
  }
};

const start = async function (options) {
  const opts = await processOptions(options);

  const { logger } = opts;
  if (logger) {
    setLogger({ logger });
  }

  opts.handleRequest = await startChain(opts);

  // Make sure all servers are starting concurrently, not serially
  const [http] = await Promise.all([
    httpStartServer(opts),
  ]);
  const servers = { http };
  return servers;
};


module.exports = {
  startServer,
};
