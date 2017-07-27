'use strict';

const { promisify } = require('util');

// Try a graceful server exit
const stopServer = async function (server) {
  await promisify(server.close.bind(server))();
};

// Count number of pending requests, to log information on server exits
const countPendingRequests = async function (server) {
  const count = await promisify(server.getConnections.bind(server))();
  return count;
};

module.exports = {
  stopServer,
  countPendingRequests,
};
