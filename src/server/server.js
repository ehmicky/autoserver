'use strict';


const { EngineStartupError } = require('../error');
const { setLogger } = require('../utilities');
const { processOptions } = require('../options');
const { start } = require('./chain');
const { httpStartServer } = require('./http');


/**
 * Start server for each protocol, for the moment only HTTP
 *
 * @param {object} options
 * @param {object} options.idl - IDL definitions
 */
const startServer = async function (options) {
  try {
    const opts = await processOptions(options);

    if (opts.logger) {
      setLogger({ logger: opts.logger });
    }

    opts.handleRequest = await start(opts);

    // Make sure all servers are starting concurrently, not serially
    const [http] = await Promise.all([
      httpStartServer(opts),
    ]);
    const servers = { http };
    return servers;
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


module.exports = {
  startServer,
};
