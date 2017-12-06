'use strict';

// Use rpc-specific logic to parse the request into an rpc-agnostic `rpcDef`
const parseRpc = function ({
  rpcAdapter: { handler },
  schema,
  origin,
  queryvars,
  headers,
  method,
  path,
  pathvars,
  payload,
}) {
  return handler({
    schema,
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
