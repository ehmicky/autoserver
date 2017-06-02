'use strict';


const { getPromise } = require('../../utilities');


// Add methods related to server exits
const addStopMethods = function (server) {
  Object.assign(server, { countPendingRequests, stop });
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


module.exports = {
  addStopMethods,
};
