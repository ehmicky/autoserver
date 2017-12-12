'use strict';

// Use rpc-specific logic to parse the request into an rpc-agnostic `rpcDef`
const parseRpc = function ({
  rpcAdapter: { handler },
  config,
  origin,
  queryvars,
  headers,
  method,
  path,
  pathvars,
  payload,
}) {
  return handler({
    config,
    origin,
    queryvars,
    headers,
    method,
    path,
    pathvars,
    payload,
  });
};

module.exports = {
  parseRpc,
};
