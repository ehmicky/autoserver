import keepFuncProps from 'keep-func-props'

import { result } from '../utils/functional/result.js'

import { throwError, normalizeError, isError } from './main.js'
import { throwPb } from './props.js'

// Wrap a function with a error handler
// Allow passing an empty error handler, i.e. ignoring any error thrown
const kAddErrorHandler = (func, errorHandler = noop) =>
  errorHandledFunc.bind(undefined, func, errorHandler)

// eslint-disable-next-line no-empty-function
const noop = () => {}

export const addErrorHandler = keepFuncProps(kAddErrorHandler)

const errorHandledFunc = (func, errorHandler, ...args) => {
  try {
    const retVal = func(...args)

    return retVal && typeof retVal.then === 'function'
      ? // eslint-disable-next-line promise/prefer-await-to-then, promise/prefer-await-to-callbacks
        retVal.catch((error) => errorHandler(error, ...args))
      : retVal
  } catch (error) {
    return errorHandler(error, ...args)
  }
}

// Use `addErrorHandler()` with a generic error handler that rethrows
export const addGenErrorHandler = (func, { message, reason, extra }) => {
  const errorHandler = genErrorHandler.bind(undefined, {
    message,
    reason,
    extra,
  })
  return kAddErrorHandler(func, errorHandler)
}

const genErrorHandler = ({ message, reason, extra }, error, ...args) => {
  const innererror = normalizeError({ error })
  const reasonA = result(reason, ...args, innererror) || innererror.reason
  const messageA = result(message, ...args, innererror) || innererror.message
  const extraA = result(extra, ...args, innererror) || innererror.extra
  throwError(messageA, { reason: reasonA, innererror, extra: extraA })
}

export const addGenPbHandler = (func, { message, reason, extra }) => {
  const errorHandler = genPbHandler.bind(undefined, { reason, message, extra })
  return kAddErrorHandler(func, errorHandler)
}

const genPbHandler = ({ message, reason, extra }, error, ...args) => {
  const innererror = normalizeError({ error })
  const messageA = result(message, ...args, innererror) || innererror.message
  const reasonA = result(reason, ...args, innererror) || innererror.reason
  const extraA = result(extra, ...args, innererror) || innererror.extra
  throwPb({ reason: reasonA, message: messageA, innererror, extra: extraA })
}

// Error handler that is noop if thrown error is using our error type
export const addCatchAllHandler = (func, errorHandler) => {
  const errorHandlerA = catchAllHandler.bind(undefined, errorHandler)
  return kAddErrorHandler(func, errorHandlerA)
}

const catchAllHandler = (errorHandler, error, ...args) => {
  if (isError({ error })) {
    throw error
  }

  return errorHandler(error, ...args)
}

// Combines `addCatchAllHandler()` + `addGenPbHandler()`
export const addCatchAllPbHandler = (func, { message, reason, extra }) => {
  const errorHandler = genPbHandler.bind(undefined, { message, reason, extra })
  return addCatchAllHandler(func, errorHandler)
}
