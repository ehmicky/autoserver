'use strict';

const { rpcAdapters } = require('../../../rpc');

const { findRoute } = require('./routes');
const { getPathvars } = require('./pathvars');

// Add route and URL parameters to mInput
const router = function ({ path }) {
  const route = findRoute({ path });
  const { rpc } = route;
  const rpcAdapter = rpcAdapters[rpc];

  const pathvars = getPathvars({ path, route });

  return { rpc, rpcAdapter, pathvars };
};

module.exports = {
  router,
};
