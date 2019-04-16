import { parse, tokensToRegExp } from 'path-to-regexp'

import { isObject } from '../../utils/functional/type.js'
import { throwPb } from '../../errors/props.js'
import { rpcAdapters } from '../wrap.js'

// Retrieve all routes regexps, rpc and variable names
const getAllRoutes = function() {
  return Object.values(rpcAdapters).flatMap(getRoutes)
}

const getRoutes = function({ routes, name: rpc }) {
  return routes.map(parseRoute).map(route => ({ ...route, rpc }))
}

// Parse `/path/:var/path2/:var2` into
// `{ regexp /.../, variables: ['var', 'var2'] }`
const parseRoute = function(route) {
  const tokens = parse(route)
  const regexp = tokensToRegExp(tokens)
  const variables = getVariables({ tokens })

  return { regexp, variables }
}

const getVariables = function({ tokens }) {
  return tokens.filter(isObject).map(({ name }) => name)
}

const allRoutes = getAllRoutes()

// Retrieves correct route, according to path
export const findRoute = function({ path }) {
  validateMissingPath({ path })

  const route = allRoutes.find(({ regexp }) => regexp.test(path))

  if (route !== undefined) {
    return route
  }

  throwPb({ reason: 'ROUTE', extra: { value: path } })
}

const validateMissingPath = function({ path }) {
  if (path !== undefined) {
    return
  }

  throwPb({ reason: 'ROUTE', extra: { value: '' } })
}
