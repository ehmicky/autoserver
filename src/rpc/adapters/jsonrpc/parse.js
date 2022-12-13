import { validatePayload } from './validate.js'

// Use JSON-RPC-specific logic to parse the request into an
// rpc-agnostic `rpcDef`
export const parse = ({ payload }) => {
  validatePayload({ payload })

  const { method, params, id } = payload

  const args = getArgs({ params })
  const argsA = addSilent({ args, id })

  const rpcDef = { commandName: method, args: argsA }
  return { rpcDef }
}

// Can either be [{ ... }], [], {...} or nothing
const getArgs = ({ params = {} }) => {
  if (!Array.isArray(params)) {
    return params
  }

  if (params.length === 0) {
    return {}
  }

  return params[0]
}

// If request `id` is absent, there should be no response according to
// JSON-RPC spec. We achieve this by settings `args.silent` `true`
const addSilent = ({ args, id }) => {
  if (id !== undefined && id !== null) {
    return args
  }

  return { ...args, silent: true }
}
