'use strict';


const { httpStartServer } = require('./http');
const { attachRequire } = require('../utilities');


/**
 * Start server for each protocol, for the moment only HTTP
 *
 * @param {object} options
 * @param {object} options.definitions - IDL definitions
 * @param {boolean} [options.bulkWrite=false] -
 */
const startServer = function (options) {
  httpStartServer(options);
  attachRequire();
};


module.exports = {
  startServer,
};