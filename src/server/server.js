'use strict';


const { httpStartServer } = require('./http');
const { attachRequire } = require('../utilities');


/**
 * Start server for each protocol, for the moment only HTTP
 *
 * @param {object} options
 * @param {object} options.idl - IDL definitions
 */
const startServer = async function (options) {
  attachRequire();
  const server = await Promise.all([
    httpStartServer(options),
  ]);
  return server;
};


module.exports = {
  startServer,
};
