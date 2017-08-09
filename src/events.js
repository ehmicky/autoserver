'use strict';

const EventEmitter2 = require('eventemitter2');

const { makeImmutable } = require('./utilities');

// Object returned by main function `startServer()`
// Contains general information (options, server name, version, etc.)
// Emits events related to server lifecycle and logging.
const createApiServer = function () {
  return new EventEmitter2({ wildcard: true });
};

const emitEventAsync = function ({ apiServer, name, data }) {
  const dataA = makeImmutable(data);
  return apiServer.emitAsync(name, dataA);
};

module.exports = {
  createApiServer,
  emitEventAsync,
};
