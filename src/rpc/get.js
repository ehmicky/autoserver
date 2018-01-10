'use strict';

const { rpcAdapters } = require('./wrap');

// Retrieves rpc adapter
const getRpc = function (rpc) {
  const rpcA = rpcAdapters[rpc];
  if (rpcA !== undefined) { return rpcA.wrapped; }

  const message = `Unsupported RPC: '${rpc}'`;
  // eslint-disable-next-line fp/no-throw
  throw new Error(message);
};

module.exports = {
  getRpc,
};
