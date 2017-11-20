'use strict';

const { protocolHandlers } = require('../../protocols');
const { rpcHandlers } = require('../../rpc');

// Build message of events of type `request` as:
//  STATUS [ERROR] - PROTOCOL METHOD RPC /PATH COMMAND...
const getRequestMessage = function ({
  protocol,
  rpc,
  method,
  path,
  error = 'SUCCESS',
  commandpath,
  summary,
}) {
  const summaryA = error === 'SUCCESS' ? summary : commandpath;

  const { title: protocolTitle } = protocolHandlers[protocol] || {};
  const { title: rpcTitle } = rpcHandlers[rpc] || {};

  const message = [
    error,
    '-',
    protocolTitle,
    method,
    rpcTitle,
    path,
    summaryA,
  ].filter(val => val)
    .join(' ');
  return message;
};

module.exports = {
  getRequestMessage,
};
