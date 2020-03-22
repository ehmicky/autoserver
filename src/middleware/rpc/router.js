import { getRpcByPath } from '../../rpc/router.js'

// Add route and URL parameters to mInput
export const router = function ({ path }) {
  const {
    rpcAdapter,
    rpcAdapter: { name: rpc },
    pathvars,
  } = getRpcByPath(path)
  return { rpc, rpcAdapter, pathvars }
}
