'use strict';

const { Log } = require('../../logging');
const { protocolHandlers } = require('../../protocols');

// Setup basic input
const setupInput = async function (
  nextFunc,
  { protocol, idl, apiServer, serverOpts, currentPerf },
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
    currentPerf,
  };

  const response = await nextFunc(input);
  return response;
};

module.exports = {
  setupInput,
};
