'use strict';

const { createLog, addLogInfo } = require('../../logging');
const { protocolHandlers } = require('../../protocols');
const { pSetTimeout } = require('../../utilities');
const { addJsl } = require('../../jsl');

// Setup basic input
const setupInput = async function (
  nextFunc,
  { idl, apiServer, runtimeOpts, currentPerf, jsl },
  { protocol, specific },
) {
  // When an exception is thrown in the same macrotask as the one that started
  // the request (e.g. in one of the first middleware), the socket won't be
  // closed even after sending back the error response.
  // Since the socket won't be closed, closing the server will hang.
  // This is unclear why, but doing this solves the problem.
  await pSetTimeout(0);

  const log = createLog({ runtimeOpts, apiServer, phase: 'request' });

  const protocolHandler = protocolHandlers[protocol];

  const input = {
    idl,
    runtimeOpts,
    apiServer,
    jsl,
    currentPerf,
    log,
    protocol,
    protocolHandler,
    specific,
  };

  const inputA = addJsl(input, { $PROTOCOL: protocol });
  const inputB = addLogInfo(inputA, { protocol });

  const response = await nextFunc(inputB);
  return response;
};

module.exports = {
  setupInput,
};
