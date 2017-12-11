'use strict';

const { rpcAdapters } = require('../../rpc');

// Fire each `rpcAdapter.load({ schema })` function
const loadRpc = function ({ schema }) {
  const output = Object.values(rpcAdapters)
    .map(({ load }) => load && load({ schema }));

  const outputA = Object.assign({}, ...output);
  return outputA;
};

module.exports = {
  loadRpc,
};
