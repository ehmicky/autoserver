'use strict';

const { protocolAdapters } = require('../../../protocols');
const { rpcAdapters } = require('../../../rpc');

// Build message of events `request` as:
//  STATUS [ERROR] - PROTOCOL METHOD RPC /PATH COMMAND...
const getRequestMessage = function ({
  protocol,
  rpc,
  method,
  path,
  commandpath = '',
  summary,
  error: { status = 'SUCCESS', description = '' } = {},
}) {
  const suffixText = getSuffixText({
    status,
    summary,
    commandpath,
    description,
  });

  const { title: protocolTitle } = protocolAdapters[protocol] || {};
  const { title: rpcTitle } = rpcAdapters[rpc] || {};

  const message = [
    status,
    '-',
    protocolTitle,
    method,
    rpcTitle,
    path,
    suffixText,
  ].filter(val => val)
    .join(' ');
  return message;
};

const getSuffixText = function ({ status, summary, commandpath, description }) {
  if (status === 'SUCCESS') { return summary; }

  if (!description) { return commandpath; }

  return `${commandpath} - ${description}`;
};

module.exports = {
  getRequestMessage,
};
