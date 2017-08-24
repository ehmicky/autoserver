'use strict';

const { reduceAsync } = require('../utilities');

const {
  addLayersErrorsHandlers,
  addMiddlewareHandler,
  getErrorMInput,
  throwMiddlewareError,
} = require('./error');

// Transforms a series of functions into a middleware pipeline.
const fireLayers = async function (middleware, mInput) {
  // The first layer `final` is special, as it is always fired,
  // whether the request is successful or not.
  const [final, ...main] = middleware;

  try {
    const mInputA = await fireLayer(main, 0, mInput);

    await fireLayer([final], 0, mInputA);
  } catch (error) {
    const mInputA = getErrorMInput({ error });

    const mInputB = await fireLayer([final], 0, mInputA);

    throwMiddlewareError(error, mInputB, { force: true });
  }
};

const eFireLayers = addLayersErrorsHandlers(fireLayers);

// Fire all the middleware functions of a given layer
const fireLayer = function (layers, lIndex, mInput) {
  // Each layer can fire the next layer middleware functions by calling this
  const nextLayer = fireLayer.bind(null, layers, lIndex + 1);
  const fireMiddlewareA = eFireMiddleware.bind(null, nextLayer);

  // Iterate over each middleware function
  return reduceAsync(layers[lIndex], fireMiddlewareA, mInput, mergeInput);
};

// Fire a specific middleware function
const fireMiddleware = function (nextLayer, mInput, mFunc) {
  return mFunc(mInput, nextLayer);
};

// We merge the return value of each middleware (`mInput`)
// with the current mInput (`mInputA`)
const mergeInput = function (mInput, mInputA) {
  const mInputB = { ...mInput, ...mInputA };
  // `mInput.mInput` is a helper for destructuring arguments
  return { ...mInputB, mInput: mInputB };
};

const eFireMiddleware = addMiddlewareHandler.bind(null, fireMiddleware);

module.exports = {
  fireLayers: eFireLayers,
};
