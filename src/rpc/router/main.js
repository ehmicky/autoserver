import { getRpc } from '../get.js'

import { findRoute } from './routes.js'
import { getPathvars } from './pathvars.js'

// Retrieves RPC using URL's path
export const getRpcByPath = function({ path }) {
  const route = findRoute({ path })
  const { rpc } = route
  const rpcAdapter = getRpc(rpc)

  const pathvars = getPathvars({ path, route })

  return { rpcAdapter, pathvars }
}
