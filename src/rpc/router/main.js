'use strict';

const { getRpc } = require('../get');

const { findRoute } = require('./routes');
const { getPathvars } = require('./pathvars');

// Retrieves RPC using URL's path
const getRpcByPath = function ({ path }) {
  const route = findRoute({ path });
  const { rpc } = route;
  const rpcAdapter = getRpc(rpc);

  const pathvars = getPathvars({ path, route });

  return { rpcAdapter, pathvars };
};

module.exports = {
  getRpcByPath,
};
