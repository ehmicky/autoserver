'use strict';


const EventEmitter2 = require('eventemitter2');

const { getServerInfo } = require('../info');


// Object returned by main function `startServer()`
// Contains general information (options, server name, version, etc.)
// Emits events related to server lifecycle and logging.
class ApiEngineServer extends EventEmitter2 {

  constructor({ serverOpts }) {
    super({ wildcard: true });

    const {
      serverId,
      serverName,
      apiEngine: { version },
    } = getServerInfo({ serverOpts });
    const info = { id: serverId, name: serverName, version };

    Object.assign(this, { info });
  }

}


module.exports = {
  ApiEngineServer,
};
