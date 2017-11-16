'use strict';

// Use rpc-specific logic to parse the request into an rpc-agnostic `rpcDef`
const parseRpc = function ({
  rpcHandler: { handler },
  schema,
  origin,
  method,
  path,
  pathvars,
  headers,
  queryvars,
  payload,
}) {
  return handler({
    schema,
    origin,
    method,
    path,
    pathvars,
    headers,
    queryvars,
    payload,
  });
};

module.exports = {
  parseRpc,
};
