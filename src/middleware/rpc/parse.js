'use strict';

// Use rpc-specific logic to parse the request into an rpc-agnostic `rpcDef`
const parseRpc = function ({
  rpcHandler: { handler },
  schema,
  origin,
  queryvars,
  method,
  path,
  pathvars,
  headers,
  payload,
}) {
  return handler({
    schema,
    origin,
    queryvars,
    method,
    path,
    pathvars,
    headers,
    payload,
  });
};

module.exports = {
  parseRpc,
};
