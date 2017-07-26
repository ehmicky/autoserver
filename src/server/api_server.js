'use strict';

const EventEmitter2 = require('eventemitter2');

const { getServerInfo } = require('../info');

// Object returned by main function `startServer()`
// Contains general information (options, server name, version, etc.)
// Emits events related to server lifecycle and logging.
const createApiServer = function ({ serverOpts }) {
  const apiServer = new EventEmitter2({ wildcard: true });

  const {
    serverId,
    serverName,
    apiEngine: { version },
  } = getServerInfo({ serverOpts });
  const info = { id: serverId, name: serverName, version };

  Object.assign(apiServer, { info });

  return apiServer;
};

module.exports = {
  createApiServer,
};
