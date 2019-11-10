import { match } from 'path-to-regexp'

import { transtype } from '../utils/transtype.js'
import { mapValues } from '../utils/functional/map.js'
import { throwPb } from '../errors/props.js'

import { rpcAdapters } from './wrap.js'
import { getRpc } from './get.js'

// Retrieves RPC using URL's path.
// Find correct route, then get path variables, e.g. /path/:id
// Will be an incrementing index e.g. for /path/* or /path/(maybe)?/
export const getRpcByPath = function(path) {
  if (path === undefined) {
    throwPb({ reason: 'ROUTE', extra: { value: '' } })
  }

  const route = allRoutes.find(allRoute => allRoute.matchRoute(path) !== false)

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
const getAllRoutes = function() {
  return Object.values(rpcAdapters).flatMap(getRoutes)
}

const getRoutes = function({ routes, name }) {
  return routes.map(route => ({ matchRoute: match(route), rpc: name }))
}

const allRoutes = getAllRoutes()
