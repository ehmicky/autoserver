'use strict';


const { httpStartServer } = require('./http');


// Start server for each protocol, for the moment only HTTP
const startServer = function () {
  httpStartServer();
};


module.exports = {
  startServer,
};