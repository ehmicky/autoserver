'use strict';

// Use rpc-specific logic to parse the request into an rpc-agnostic `rpcDef`
const parseRpc = function ({ mInput, rpcHandler: { handler } }) {
  return handler(mInput);
};

module.exports = {
  parseRpc,
};
