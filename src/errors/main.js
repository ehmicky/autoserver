'use strict'

const { difference } = require('../utils')

const { ERROR_TYPE, ALLOWED_OPTS, MISSING_MESSAGE } = require('./constants')
const { getInnerError } = require('./inner')

// Note that any exception thrown in the `error` module might not create an
// event (since this is the error), so we must be precautious.
const createError = function (message, opts = {}) {
  validateError(opts)

  const innererror = getInnerError(opts)

  const error = new Error(message)
  // This is the only way to keep it an instanceof Error
  // eslint-disable-next-line fp/no-mutating-assign
  Object.assign(error, { extra: {}, ...opts, innererror, type: ERROR_TYPE })

  return error
}

// Make sure signature is correct
const validateError = function (opts) {
  // Check whitelisted options
  const optsKeys = Object.keys(opts)
  const nonAllowedOpts = difference(optsKeys, ALLOWED_OPTS)

  if (nonAllowedOpts.length === 0) { return }

  const message = `Cannot use options '${nonAllowedOpts}' when throwing an error`
  throwError(message, { reason: 'ENGINE' })
}

const isError = function ({ error }) {
  return error && error.type === ERROR_TYPE
}

const throwError = function (message = MISSING_MESSAGE, opts) {
  const stack = message.stack || getStack({ caller: throwError })
  const error = createError(message, { ...opts, stack })
  // eslint-disable-next-line fp/no-throw
  throw error
}

const rethrowError = function (error) {
  // eslint-disable-next-line fp/no-throw
  throw error
}

// External dependencies might throw errors that are not instances of
// our types of error, so we want to fix those.
const normalizeError = function ({ error }) {
  if (isError({ error })) { return error }

  const errorMessage = getErrorMessage({ error })
  const stack = (error && error.stack) || getStack({ caller: normalizeError })
  return createError(errorMessage, { stack })
}

const getErrorMessage = function ({ error }) {
  if (typeof error === 'string') { return error }
  if (error.message) { return error.message }
  return ''
}

const getStack = function ({ caller } = {}) {
  const stackObj = {}
  Error.captureStackTrace(stackObj, caller)
  return stackObj.stack
}

module.exports = {
  createError,
  throwError,
  rethrowError,
  normalizeError,
  isError,
}
