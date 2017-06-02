'use strict';


const EventEmitter2 = require('eventemitter2');

const { getServerInfo } = require('../info');


class ApiEngineServer extends EventEmitter2 {

  constructor() {
    super({ wildcard: true });

    const { serverId, serverName, apiEngine: { version } } = getServerInfo();
    const info = { id: serverId, name: serverName, version };

    Object.assign(this, { info });
  }

}


module.exports = {
  ApiEngineServer,
};
