import { addErrorHandler } from '../errors/handler.js'
import { monitor } from '../perf/helpers.js'
import { reduceAsync } from '../utils/functional/reduce.js'

import {
  fireErrorHandler,
  fireMainLayersHandler,
  fireMiddlewareHandler,
} from './error/main.js'
import { middlewareLayers } from './layers.js'

// Called once per server startup
export const getRequestHandler = () => {
  // Add performance monitoring
  const allLayersA = middlewareLayers.map(monitorLayers)
  const requestHandler = eFireLayers.bind(undefined, allLayersA)
  return { requestHandler }
}

// Add performance monitoring to every request.
// Calculate how much time each middleware takes,
// and push measurement to `reqState.measures` array.
const monitorLayers = ({ layers, name, ...rest }) => {
  const layersA = layers.map((mFunc) => monitor(mFunc, mFunc.name, name, 2))
  return { layers: layersA, name, ...rest }
}

// Main request handler, i.e. called once per request
// Transforms a series of functions into a middleware pipeline.
const fireLayers = async (allLayers, mInput) => {
  // Request state object
  // Since we try to avoid mutations, this is only used where purely functional
  // code would be verbose.
  // Used only by performance monitoring
  const reqState = { measures: [] }

  const mInputA = await eFireMainLayers({ allLayers, mInput, reqState })
  await fireFinalLayer({ allLayers, mInput: mInputA, reqState })
}

// Fires allLayers[1], i.e. skip `final`
const fireMainLayers = ({ allLayers, mInput, reqState }) =>
  fireLayer({ allLayers, reqState }, mInput, 'time')

// Fires allLayers[0], i.e. `final`, a special layer that it is always
// fired, whether the request is successful or not.
// It does not call `nextLayer()`, so allLayers[1] won't be called
const fireFinalLayer = ({ allLayers, mInput, reqState }) =>
  fireLayer({ allLayers, reqState }, mInput, 'final')

// Fire all the middleware functions of a given layer
const fireLayer = ({ allLayers, reqState }, mInput, name) => {
  const { layers } = getLayer({ allLayers, name })

  // Each layer can fire the next layer middleware functions by calling this
  const nextLayer = fireLayer.bind(undefined, { allLayers, reqState })
  const fireMiddlewareA = eFireMiddleware.bind(undefined, nextLayer, reqState)

  // Iterate over each middleware function
  return reduceAsync(layers, fireMiddlewareA, mInput, mergeInput)
}

const getLayer = ({ allLayers, name }) =>
  allLayers.find(({ name: nameA }) => name === nameA)

// Fire a specific middleware function
// eslint-disable-next-line max-params
const fireMiddleware = (nextLayer, reqState, mInput, mFunc) => {
  // `mInput.mInput` is a helper for destructuring arguments
  const mInputA = { ...mInput, mInput }
  return mFunc(mInputA, nextLayer, reqState)
}

// We merge the return value of each middleware (`mInput`)
// with the current mInput (`mInputA`)
const mergeInput = (mInput, mInputA) => ({ ...mInput, ...mInputA })

// Middleware error handler
const eFireMiddleware = addErrorHandler(fireMiddleware, fireMiddlewareHandler)

// Main layers error handler
const eFireMainLayers = addErrorHandler(
  fireMainLayers,
  fireMainLayersHandler.bind(undefined, fireFinalLayer),
)

// Top-level request error handlers
const eFireLayers = addErrorHandler(fireLayers, fireErrorHandler)
