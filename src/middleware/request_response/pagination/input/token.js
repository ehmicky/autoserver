import filterObj from 'filter-obj'

import { addGenErrorHandler } from '../../../../errors/handler.js'
import { throwError } from '../../../../errors/main.js'
import { mapValues } from '../../../../utils/functional/map.js'
import { isObject } from '../../../../utils/functional/type.js'
import { decode } from '../encoding/main.js'
import { getRightToken, TOKEN_NAMES, BOUNDARY_TOKEN } from '../info.js'

// Parse cursor tokens
export const getToken = function ({ args }) {
  const tokens = filterObj(args, TOKEN_NAMES)
  const tokensA = filterObj(tokens, isValidToken)
  const tokensB = mapValues(tokensA, (token, name) => eDecode({ token, name }))
  const tokenA = getRightToken({ tokens: tokensB })
  return tokenA
}

const isValidToken = function (key, token) {
  return token !== undefined && token !== BOUNDARY_TOKEN
}

const eDecode = addGenErrorHandler(decode, {
  message: ({ name }) => `Wrong arguments: '${name}' contains an invalid token`,
  reason: 'VALIDATION',
})

// Validate cursor tokens syntax
export const validateToken = function ({ token }) {
  if (token === undefined) {
    return
  }

  const isValid = TOKEN_TESTS.every((testFunc) => testFunc(token))

  if (isValid) {
    return
  }

  const message =
    "Wrong arguments: 'after' or 'before' contains an invalid token"
  throwError(message, { reason: 'VALIDATION' })
}

// List of tests to validate token syntax
const TOKEN_TESTS = [
  (tokenObj) => isObject(tokenObj),

  ({ order }) => order === undefined || typeof order === 'string',

  ({ filter }) => filter == null || typeof filter === 'object',

  ({ parts }) => Array.isArray(parts) && parts.length > 0,
]
