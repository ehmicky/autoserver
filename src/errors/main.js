import { difference } from '../utils/functional/difference.js'

import { getInnerError } from './inner.js'

// Note that any exception thrown in the `error` module might not create an
// event (since this is the error), so we must be precautious.
export const createError = (message, opts = {}) => {
  validateError(opts)

  const innererror = getInnerError(opts)

  const error = new Error(message)
  // This is the only way to keep it an instanceof Error
  // eslint-disable-next-line fp/no-mutating-assign
  Object.assign(error, { extra: {}, ...opts, innererror, type: ERROR_TYPE })

  return error
}

// Make sure signature is correct
const validateError = (opts) => {
  // Check allowed options
  const optsKeys = Object.keys(opts)
  const nonAllowedOpts = difference(optsKeys, ALLOWED_OPTS)

  if (nonAllowedOpts.length === 0) {
    return
  }

  const message = `Cannot use options '${nonAllowedOpts}' when throwing an error`
  throwError(message, { reason: 'ENGINE' })
}

const ALLOWED_OPTS = ['reason', 'stack', 'innererror', 'extra']

export const isError = ({ error }) => error && error.type === ERROR_TYPE

const ERROR_TYPE = Symbol('error')

export const throwError = (message = MISSING_MESSAGE, opts = {}) => {
  const stack = message.stack || getStack({ caller: throwError })
  const error = createError(message, { ...opts, stack })
  throw error
}

const MISSING_MESSAGE = 'Missing error message'

// External dependencies might throw errors that are not instances of
// our types of error, so we want to fix those.
export const normalizeError = ({ error }) => {
  if (isError({ error })) {
    return error
  }

  const errorMessage = getErrorMessage({ error })
  const stack = (error && error.stack) || getStack({ caller: normalizeError })
  return createError(errorMessage, { stack })
}

const getErrorMessage = ({ error }) => {
  if (typeof error === 'string') {
    return error
  }

  if (error.message) {
    return error.message
  }

  return ''
}

const getStack = ({ caller } = {}) => {
  const stackObj = {}
  Error.captureStackTrace(stackObj, caller)
  return stackObj.stack
}
