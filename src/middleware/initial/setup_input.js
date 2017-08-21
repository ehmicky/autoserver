'use strict';

const { addReqInfo } = require('../../events');
const { protocolHandlers } = require('../../protocols');
const { addIfv } = require('../../idl_func');

// Setup basic input
const setupInput = async function (
  nextFunc,
  { idl, runOpts, currentPerf, ifv },
  { protocol, specific },
) {
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
