'use strict';


const { promisify } = require('util');


// Add methods related to server exits
const addStopMethods = function (server) {
  Object.assign(server, { stop, countPendingRequests });
};

// Try a graceful server exit
const stop = async function () {
  await promisify(this.close.bind(this))();
};

// Count number of pending requests, to log information on server exits
const countPendingRequests = async function () {
  return await promisify(this.getConnections.bind(this))();
};


module.exports = {
  addStopMethods,
};
