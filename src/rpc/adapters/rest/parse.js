import { getArgs } from './args.js'

// Use JSON-RPC-specific logic to parse the request into an
// rpc-agnostic `rpcDef`
export const parse = function ({
  payload,
  method,
  queryvars,
  pathvars: { clientCollname, id },
}) {
  const commandName = `${METHODS_MAP[method]}_${clientCollname}`
  const args = getArgs({ method, payload, queryvars, id })
  return { rpcDef: { commandName, args } }
}

const METHODS_MAP = {
  GET: 'find',
  HEAD: 'find',
  POST: 'create',
  PUT: 'upsert',
  PATCH: 'patch',
  DELETE: 'delete',
}
