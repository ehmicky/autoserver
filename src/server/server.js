'use strict';


const { EngineStartupError } = require('../error');
const { setLogger, attachRequire } = require('../utilities');
const { httpStartServer } = require('./http');
const { processOptions } = require('./process_options');


/**
 * Start server for each protocol, for the moment only HTTP
 *
 * @param {object} options
 * @param {object} options.idl - IDL definitions
 */
const startServer = async function (options) {
  try {
    attachRequire();

    const opts = await processOptions(options);

    if (opts.logger) {
      setLogger({ logger: opts.logger });
    }

    const server = await Promise.all([
      httpStartServer(opts),
    ]);
    return server;
  // Make sure all exceptions thrown at startup follow the EngineStartupError signature
  } catch (innererror) {
    if (innererror instanceof EngineStartupError) {
      throw innererror;
    } else {
      throw new EngineStartupError(innererror.message, { reason: 'UNKNOWN', innererror });
    }
  }
};


module.exports = {
  startServer,
};
