'use strict';

const { getRpcByPath } = require('../../rpc');

// Add route and URL parameters to mInput
const router = function ({ path }) {
  const { rpc, rpcAdapter, pathvars } = getRpcByPath({ path });
  return { rpc, rpcAdapter, pathvars };
};

module.exports = {
  router,
};
