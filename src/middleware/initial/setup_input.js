'use strict';


const { Log } = require('../../logging');


// Setup basic input
const setupInput = function ({ serverOpts, serverState }) {
  return async function setupInput(protocol, specific) {
    const log = new Log({ serverOpts, serverState, phase: 'request' });

    const input = { specific, protocol, log };

    const response = await this.next(input);
    return response;
  };
};


module.exports = {
  setupInput,
};
