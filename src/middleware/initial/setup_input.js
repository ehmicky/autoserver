'use strict';

const { Log } = require('../../logging');
const { protocolHandlers } = require('../../protocols');

// Setup basic input
const setupInput = async function (
  protocol,
  idl,
  apiServer,
  serverOpts,
  specific,
) {
  const log = new Log({ serverOpts, apiServer, phase: 'request' });
  log.add({ protocol });

  const protocolHandler = protocolHandlers[protocol];

  const input = {
    protocol,
    idl,
    serverOpts,
    apiServer,
    specific,
    log,
    protocolHandler,
  };

  const response = await this.next(input);
  return response;
};

module.exports = {
  setupInput,
};
