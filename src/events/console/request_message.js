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
  commandpath,
  summary,
  error: { status = 'SUCCESS' } = {},
}) {
  const summaryA = status === 'SUCCESS' ? summary : commandpath;

  const { title: protocolTitle } = protocolHandlers[protocol] || {};
  const { title: rpcTitle } = rpcHandlers[rpc] || {};

  const message = [
    status,
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
