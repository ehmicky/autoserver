import { match } from 'path-to-regexp'

import { throwPb } from '../errors/props.js'
import { mapValues } from '../utils/functional/map.js'
import { transtype } from '../utils/transtype.js'

import { getRpc } from './get.js'
import { rpcAdapters } from './wrap.js'

// Retrieves RPC using URL's path.
// Find correct route, then get path variables, e.g. /path/:id
// Will be an incrementing index e.g. for /path/* or /path/(maybe)?/
export const getRpcByPath = (path) => {
  if (path === undefined) {
    throwPb({ reason: 'ROUTE', extra: { value: '' } })
  }

  const route = allRoutes.find(
    (allRoute) => allRoute.matchRoute(path) !== false,
  )

  if (route === undefined) {
    throwPb({ reason: 'ROUTE', extra: { value: path } })
  }

  const { matchRoute, rpc } = route

  const { params } = matchRoute(path)
  const pathvars = mapValues(params, transtype)

  const rpcAdapter = getRpc(rpc)
  return { rpcAdapter, pathvars }
}

// Retrieve all routes regexps, rpc and variable names
const getAllRoutes = () => Object.values(rpcAdapters).flatMap(getRoutes)

const getRoutes = ({ routes, name }) =>
  routes.map((route) => ({
    matchRoute: match(route, { decode: decodeURIComponent }),
    rpc: name,
  }))

const allRoutes = getAllRoutes()
