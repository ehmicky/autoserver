'use strict';

const { promisify } = require('util');

// Try a graceful server exit
const stopServer = function ({ server }) {
  return promisify(server.close.bind(server))();
};

module.exports = {
  stopServer,
};
