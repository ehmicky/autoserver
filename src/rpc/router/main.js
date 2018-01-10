'use strict';

const { rpcAdapters } = require('../merger');

const { findRoute } = require('./routes');
const { getPathvars } = require('./pathvars');

// Retrieves RPC using URL's path
const getRpcByPath = function ({ path }) {
  const route = findRoute({ path });
  const { rpc } = route;
  const rpcAdapter = rpcAdapters[rpc];

  const pathvars = getPathvars({ path, route });

  return { rpc, rpcAdapter, pathvars };
};

module.exports = {
  getRpcByPath,
};
