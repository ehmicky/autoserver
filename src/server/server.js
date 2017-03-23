'use strict';


const { httpStartServer } = require('./http');
const { attachRequire } = require('../utilities');


/**
 * Start server for each protocol, for the moment only HTTP
 *
 * @param {object} options
 * @param {object} options.definitions - IDL definitions
 * @param {boolean} [options.bulkWrite=false] - allow bulk methods for updates, upserts, create, replace
 * @param {boolean} [options.bulkDelete=false] - allow bulk methods for deletes
 */
const startServer = function (options) {
  httpStartServer(options);
  attachRequire();
};


module.exports = {
  startServer,
};