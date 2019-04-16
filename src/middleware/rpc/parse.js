// Use rpc-specific logic to parse the request into an rpc-agnostic `rpcDef`
export const parseRpc = function({
  rpcAdapter: { parse },
  config,
  origin,
  queryvars,
  headers,
  method,
  path,
  pathvars,
  payload,
}) {
  return parse({
    config,
    origin,
    queryvars,
    headers,
    method,
    path,
    pathvars,
    payload,
  })
}
