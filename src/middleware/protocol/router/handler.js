'use strict';

const { rpcHandlers } = require('../../../rpc');

const { findRoute } = require('./routes');
const { getPathvars } = require('./pathvars');

// Add route and URL parameters to mInput
const router = function ({ path }) {
  const route = findRoute({ path });
  const { rpc } = route;
  const rpcHandler = rpcHandlers[rpc];

  const pathvars = getPathvars({ path, route });

  return { rpc, rpcHandler, pathvars };
};

module.exports = {
  router,
};
