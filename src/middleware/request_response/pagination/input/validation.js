import { isDeepStrictEqual } from 'node:util'

import { throwError } from '../../../../errors/main.js'
import { SAME_ARGS } from '../info.js'

import { validateToken } from './token.js'

// Validate pagination input arguments
export const validatePaginationInput = ({ args, topargs, token }) => {
  validators.forEach((validator) => {
    validator({ args, topargs, token })
  })
}

// eslint-disable-next-line complexity
const validateBothTypes = ({ args }) => {
  const hasOffset = args.page !== undefined && args.page !== null
  const hasCursor =
    (args.before !== undefined && args.before !== null) ||
    (args.after !== undefined && args.after !== null)
  const bothTypes = hasOffset && hasCursor

  if (!bothTypes) {
    return
  }

  const message =
    "Wrong arguments: cannot specify both 'page' and 'before' or 'after'"
  throwError(message, { reason: 'VALIDATION' })
}

// eslint-disable-next-line complexity
const validateBothDirection = ({ args }) => {
  const bothDirection =
    args.before !== undefined &&
    args.before !== null &&
    args.after !== undefined &&
    args.after !== null

  if (!bothDirection) {
    return
  }

  const message = "Wrong arguments: cannot specify both 'before' and 'after'"
  throwError(message, { reason: 'VALIDATION' })
}

const validateSameTopargs = ({ topargs, token }) => {
  SAME_ARGS.forEach((name) => {
    validateSameToparg({ topargs, token, name })
  })
}

const validateSameToparg = ({ topargs, token, name }) => {
  if (token === undefined) {
    return
  }

  const hasSameToparg = isDeepStrictEqual(topargs[name], token[name])

  if (hasSameToparg) {
    return
  }

  const message = `Wrong arguments: when iterating over a pagination cursor, the same '${name}' argument must be used. The current '${name}' argument is ${JSON.stringify(
    topargs[name],
  )} but it should be ${JSON.stringify(token[name])}`
  throwError(message, { reason: 'VALIDATION' })
}

const validators = [
  validateToken,
  validateBothTypes,
  validateBothDirection,
  validateSameTopargs,
]
