'use strict'

const { keepProps, result } = require('../utils')

const { throwError, normalizeError, isError } = require('./main')
const { throwPb } = require('./props')

// Wrap a function with a error handler
// Allow passing an empty error handler, i.e. ignoring any error thrown
const addErrorHandler = function(func, errorHandler = () => undefined) {
  return errorHandledFunc.bind(null, func, errorHandler)
}

const kAddErrorHandler = keepProps(addErrorHandler)

const errorHandledFunc = function(func, errorHandler, ...args) {
  try {
    const retVal = func(...args)

    // eslint-disable-next-line promise/prefer-await-to-then
    return retVal && typeof retVal.then === 'function'
      ? retVal.catch(error => errorHandler(error, ...args))
      : retVal
  } catch (error) {
    return errorHandler(error, ...args)
  }
}

// Use `addErrorHandler()` with a generic error handler that rethrows
const addGenErrorHandler = function(func, { message, reason, extra }) {
  const errorHandler = genErrorHandler.bind(null, { message, reason, extra })
  return kAddErrorHandler(func, errorHandler)
}

const genErrorHandler = function({ message, reason, extra }, error, ...args) {
  const innererror = normalizeError({ error })
  const reasonA = result(reason, ...args, innererror) || innererror.reason
  const messageA = result(message, ...args, innererror) || innererror.message
  const extraA = result(extra, ...args, innererror) || innererror.extra
  throwError(messageA, { reason: reasonA, innererror, extra: extraA })
}

const addGenPbHandler = function(func, { message, reason, extra }) {
  const errorHandler = genPbHandler.bind(null, { reason, message, extra })
  return kAddErrorHandler(func, errorHandler)
}

const genPbHandler = function({ message, reason, extra }, error, ...args) {
  const innererror = normalizeError({ error })
  const messageA = result(message, ...args, innererror) || innererror.message
  const reasonA = result(reason, ...args, innererror) || innererror.reason
  const extraA = result(extra, ...args, innererror) || innererror.extra
  throwPb({ reason: reasonA, message: messageA, innererror, extra: extraA })
}

// Error handler that is noop if thrown error is using our error type
const addCatchAllHandler = function(func, errorHandler) {
  const errorHandlerA = catchAllHandler.bind(null, errorHandler)
  return kAddErrorHandler(func, errorHandlerA)
}

const catchAllHandler = function(errorHandler, error, ...args) {
  if (isError({ error })) {
    throw error
  }

  return errorHandler(error, ...args)
}

// Combines `addCatchAllHandler()` + `addGenPbHandler()`
const addCatchAllPbHandler = function(func, { message, reason, extra }) {
  const errorHandler = genPbHandler.bind(null, { message, reason, extra })
  return addCatchAllHandler(func, errorHandler)
}

module.exports = {
  addErrorHandler: kAddErrorHandler,
  addGenErrorHandler,
  addGenPbHandler,
  addCatchAllHandler,
  addCatchAllPbHandler,
}
