'use strict';


const { Log } = require('../../logging');


// Setup basic input
const setupInput = function ({ serverOpts }) {
  return async function setupInput(specific = {}) {
    const log = new Log({ serverOpts, phase: 'request' });
    const input = { specific, log };

    const response = await this.next(input);
    return response;
  };
};


module.exports = {
  setupInput,
};
