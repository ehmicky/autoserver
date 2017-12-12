'use strict';

const { rpcAdapters } = require('../../rpc');

// Fire each `rpcAdapter.load({ config })` function
const loadRpc = function ({ config }) {
  const output = Object.values(rpcAdapters)
    .map(({ load }) => load && load({ config }));

  const outputA = Object.assign({}, ...output);
  return outputA;
};

module.exports = {
  loadRpc,
};
