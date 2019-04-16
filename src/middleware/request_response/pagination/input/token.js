const { pick, pickBy } = require('../../../../utils/functional/filter.js')
const { mapValues } = require('../../../../utils/functional/map.js')
const { isObject } = require('../../../../utils/functional/type.js')
const { addGenErrorHandler } = require('../../../../errors/handler.js')
const { throwError } = require('../../../../errors/main.js')
const { decode } = require('../encoding/main.js')
const { getRightToken, TOKEN_NAMES, BOUNDARY_TOKEN } = require('../info')

// Parse cursor tokens
const getToken = function({ args }) {
  const tokens = pick(args, TOKEN_NAMES)
  const tokensA = pickBy(
    tokens,
    token => token !== undefined && token !== BOUNDARY_TOKEN,
  )
  const tokensB = mapValues(tokensA, (token, name) => eDecode({ token, name }))
  const tokenA = getRightToken({ tokens: tokensB })
  return tokenA
}

const eDecode = addGenErrorHandler(decode, {
  message: ({ name }) => `Wrong arguments: '${name}' contains an invalid token`,
  reason: 'VALIDATION',
})

// Validate cursor tokens syntax
const validateToken = function({ token }) {
  if (token === undefined) {
    return
  }

  const isValid = TOKEN_TESTS.every(testFunc => testFunc(token))

  if (isValid) {
    return
  }

  const message =
    "Wrong arguments: 'after' or 'before' contains an invalid token"
  throwError(message, { reason: 'VALIDATION' })
}

// List of tests to validate token syntax
const TOKEN_TESTS = [
  tokenObj => isObject(tokenObj),

  ({ order }) => order === undefined || typeof order === 'string',

  ({ filter }) => filter == null || typeof filter === 'object',

  ({ parts }) => Array.isArray(parts) && parts.length > 0,
]

module.exports = {
  getToken,
  validateToken,
}
