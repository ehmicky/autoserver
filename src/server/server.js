'use strict';


const { httpStartServer } = require('./http');
const { attachRequire } = require('../utilities');


/**
 * Start server for each protocol, for the moment only HTTP
 *
 * @param {object} options
 * @param {object} options.definitions - IDL definitions
 */
const startServer = async function (options) {
  attachRequire();
  return await Promise.all([
    httpStartServer(options),
  ]);
};


module.exports = {
  startServer,
};