const { addErrorHandler } = require('../../errors/handler.js')
const { getProps } = require('../../errors/props.js')
const { normalizeError } = require('../../errors/main.js')
const { omit } = require('../../utils/functional/filter.js')
const { safetyHandler } = require('../../log/main.js')

const { errorHandler } = require('./handler')

// Middleware function error handler, which just rethrow the error,
// and adds the current `mInput` as information by setting `error.mInput`
const fireMiddlewareHandler = function(error, ...args) {
  // Skip `nextLayer` and `reqState` arguments
  const errorA = error.mInput ? error : addMInput(error, args[2])
  throw errorA
}

// Main layers error handler
const fireMainLayersHandler = async function(
  fireFinalLayer,
  error,
  { allLayers, reqState },
) {
  const mInput = getErrorMInput({ error })

  // Only fire main error handler on server-side errors
  const { status } = getProps(error)

  if (status && status !== 'SERVER_ERROR') {
    return mInput
  }

  // Final layer are called before error handlers, except if the error
  // was raised by the final layer itself
  const mInputA = await fireFinalLayer({ allLayers, mInput, reqState })

  const errorA = addMInput(error, mInputA)
  throw errorA
}

// Fire request error handlers
const eFireErrorHandler = function(errorA) {
  const mInputA = getErrorMInput({ error: errorA })
  return errorHandler(mInputA)
}

// If error handler itself fails, gives up
const fireErrorHandler = addErrorHandler(eFireErrorHandler, safetyHandler)

// Add `error.mInput`, to keep track of current `mInput` during exception flow
const addMInput = function(error, mInput) {
  const mInputA = omit(mInput, 'error')
  const errorA = normalizeError({ error })
  // We need to directly mutate to keep Error constructor
  // eslint-disable-next-line fp/no-mutating-assign
  Object.assign(errorA, { mInput: mInputA })

  return errorA
}

// Builds `mInput` with a `mInput.error` property
const getErrorMInput = function({ error, error: { mInput = {} } }) {
  const errorA = normalizeError({ error })
  return { ...mInput, mInput, error: errorA }
}

module.exports = {
  fireMiddlewareHandler,
  fireMainLayersHandler,
  fireErrorHandler,
}
