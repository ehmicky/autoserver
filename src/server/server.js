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
  // Make sure all exceptions thrown at startup follow
  // the EngineStartupError signature
  } catch (innererror) {
    if (innererror instanceof EngineStartupError) {
      throw innererror;
    } else {
      throw new EngineStartupError(innererror.message, {
        reason: 'UNKNOWN',
        innererror,
      });
    }
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
