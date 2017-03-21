'use strict';


const { httpStartServer } = require('./http');
const { attachRequire } = require('../utilities');


// Start server for each protocol, for the moment only HTTP
const startServer = function () {
  httpStartServer();
  attachRequire();
};


module.exports = {
  startServer,
};