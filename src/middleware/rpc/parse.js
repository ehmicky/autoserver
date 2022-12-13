// Use rpc-specific logic to parse the request into an rpc-agnostic `rpcDef`
export const parseRpc = ({
  rpcAdapter: { parse },
  config,
  origin,
  queryvars,
  headers,
  method,
  path,
  pathvars,
  payload,
}) =>
  parse({
    config,
    origin,
    queryvars,
    headers,
    method,
    path,
    pathvars,
    payload,
  })
