'use strict';

const { addReqInfo } = require('../../events');
const { protocolHandlers } = require('../../protocols');
const { pSetTimeout } = require('../../utilities');
const { addIfv } = require('../../idl_func');

// Setup basic input
const setupInput = async function (
  nextFunc,
  { idl, runOpts, currentPerf, ifv },
  { protocol, specific },
) {
  // When an exception is thrown in the same macrotask as the one that started
  // the request (e.g. in one of the first middleware), the socket won't be
  // closed even after sending back the error response.
  // Since the socket won't be closed, closing the server will hang.
  // This is unclear why, but doing this solves the problem.
  await pSetTimeout(0);

  const reqInfo = {};

  const protocolHandler = protocolHandlers[protocol];

  const input = {
    idl,
    runOpts,
    ifv,
    currentPerf,
    reqInfo,
    protocol,
    protocolHandler,
    specific,
  };

  const inputA = addIfv(input, { $PROTOCOL: protocol });
  const inputB = addReqInfo(inputA, { protocol });

  const response = await nextFunc(inputB);
  return response;
};

module.exports = {
  setupInput,
};
