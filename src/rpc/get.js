'use strict';

const { getAdapter } = require('../adapters');

const { rpcAdapters } = require('./wrap');

// Retrieves rpc adapter
const getRpc = function (key) {
  return getAdapter({ adapters: rpcAdapters, key, name: 'RPC' });
};

module.exports = {
  getRpc,
};
