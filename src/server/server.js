'use strict';


const { httpStartServer } = require('./http');
const { attachRequire } = require('../utilities');
const { processOptions } = require('./process_options');


/**
 * Start server for each protocol, for the moment only HTTP
 *
 * @param {object} options
 * @param {object} options.idl - IDL definitions
 */
const startServer = async function (options) {
  attachRequire();
  const opts = await processOptions(options);
  const server = await Promise.all([
    httpStartServer(opts),
  ]);
  return server;
};


module.exports = {
  startServer,
};
