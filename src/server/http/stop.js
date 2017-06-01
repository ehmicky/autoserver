'use strict';


const { getPromise } = require('../../utilities');


// Add methods related to server exits
const addStopMethods = function (server) {
  Object.assign(server, { countPendingRequests, stop, kill });
};

// Count number of pending requests, to log information on server exits
const countPendingRequests = function () {
  const promise = getPromise();
  this.getConnections((error, count) => {
    if (error) { promise.reject(error); }
    promise.resolve(count);
  });
  return promise;
};

// Try a graceful server exit
const stop = function () {
  const promise = getPromise();
  this.close(() => {
    promise.resolve();
  });
  return promise;
};

// Force an exit
// Do not call process.exit() or similar, as this library might just be
// part of a bigger process.
const kill = function () {
  this.unref();
};


module.exports = {
  addStopMethods,
};
