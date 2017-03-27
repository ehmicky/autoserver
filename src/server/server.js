'use strict';


const { httpStartServer } = require('./http');
const { attachRequire, console } = require('../utilities');


/**
 * Start server for each protocol, for the moment only HTTP
 *
 * @param {object} options
 * @param {object} options.definitions - IDL definitions
 */
const startServer = async function (options) {
  try {
    attachRequire();
    const server = await Promise.all([
      httpStartServer(options),
    ]);
    return server;
  } catch (exception) {
    console.error(exception);
    throw exception;
  }
};


module.exports = {
  startServer,
};