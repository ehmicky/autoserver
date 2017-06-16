'use strict';


const { Log } = require('../../logging');
const { protocolHandlers } = require('../../protocols');


// Setup basic input
const setupInput = function ({ serverOpts, serverState }) {
  return async function setupInput(protocol, specific) {
    const log = new Log({ serverOpts, serverState, phase: 'request' });
    log.add({ protocol });

    const protocolHandler = protocolHandlers[protocol];

    const input = { specific, protocol, protocolHandler, log };

    const response = await this.next(input);
    return response;
  };
};


module.exports = {
  setupInput,
};
