'use strict';

const { Log } = require('../../logging');
const { protocolHandlers } = require('../../protocols');
const { pSetTimeout } = require('../../utilities');

// Setup basic input
const setupInput = async function (
  nextFunc,
  { protocol, idl, apiServer, serverOpts, currentPerf },
  specific,
) {
  // When an exception is thrown in the same macrotask as the one that started
  // the request (e.g. in one of the first middleware), the socket won't be
  // closed even after sending back the error response.
  // Since the socket won't be closed, closing the server will hang.
  // This is unclear why, but doing this solves the problem.
  await pSetTimeout(0);

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
