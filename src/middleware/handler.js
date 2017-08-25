'use strict';

const { reduceAsync } = require('../utilities');
const { monitor } = require('../perf');

const { middlewareLayers } = require('./layers');
const {
  addLayersErrorsHandlers,
  addMiddlewareHandler,
  getErrorMInput,
  throwMiddlewareError,
} = require('./error');

// Called once per server startup
const getRequestHandler = function () {
  // Add performance monitoring
  const allLayersA = middlewareLayers.map(monitorLayers);
  const requestHandler = eFireLayers.bind(null, allLayersA);
  return { requestHandler };
};

// Add performance monitoring to every request.
// Calculate how much time each middleware takes,
// and push measurement to `reqState.measures` array.
const monitorLayers = function ({ layers, name, ...rest }) {
  const layersA = layers.map(mFunc => monitor(mFunc, mFunc.name, name, 2));
  return { layers: layersA, name, ...rest };
};

// Main request handler, i.e. called once per request
// Transforms a series of functions into a middleware pipeline.
const fireLayers = async function (allLayers, mInput) {
  // Request state object
  // Since we try to avoid mutations, this is only used where purely functional
  // code would be verbose.
  // Used only by performance monitoring
  const reqState = { measures: [] };

  const mInputA = await fireMainLayers({ allLayers, mInput, reqState });
  await fireFinalLayer({ allLayers, mInput: mInputA, reqState });
};

// Fires allLayers[1], i.e. skip `final`
const fireMainLayers = async function ({ allLayers, mInput, reqState }) {
  try {
    return await fireLayer(allLayers.slice(1), reqState, mInput);
  } catch (error) {
    const mInputA = getErrorMInput({ error });

    // Final layer are called before error handlers, except if the error
    // was raised by the final layer itself
    const mInputB = await fireLayer(allLayers, reqState, mInputA);

    throwMiddlewareError(error, mInputB, { force: true });
  }
};

// Fires allLayers[0], i.e. `final`, a special layer that it is always
// fired, whether the request is successful or not.
// It does not call `nextLayer()`, so allLayers[1] won't be called
const fireFinalLayer = async function ({ allLayers, mInput, reqState }) {
  try {
    return await fireLayer(allLayers, reqState, mInput);
  } catch (error) {
    const mInputA = getErrorMInput({ error });

    throwMiddlewareError(error, mInputA, { force: true });
  }
};

const eFireLayers = addLayersErrorsHandlers(fireLayers);

// Fire all the middleware functions of a given layer
const fireLayer = function (allLayers, reqState, mInput) {
  const [{ layers }] = allLayers;
  // Each layer can fire the next layer middleware functions by calling this
  const nextLayer = fireLayer.bind(null, allLayers.slice(1), reqState);

  const fireMiddlewareA = eFireMiddleware.bind(null, nextLayer, reqState);

  // Iterate over each middleware function
  return reduceAsync(layers, fireMiddlewareA, mInput, mergeInput);
};

// Fire a specific middleware function
// eslint-disable-next-line max-params
const fireMiddleware = function (nextLayer, reqState, mInput, mFunc) {
  // `mInput.mInput` is a helper for destructuring arguments
  const mInputA = { ...mInput, mInput };
  return mFunc(mInputA, nextLayer, reqState);
};

// We merge the return value of each middleware (`mInput`)
// with the current mInput (`mInputA`)
const mergeInput = function (mInput, mInputA) {
  return { ...mInput, ...mInputA };
};

const eFireMiddleware = addMiddlewareHandler(fireMiddleware);

module.exports = {
  getRequestHandler,
};
