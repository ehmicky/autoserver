'use strict';

const { reduceAsync } = require('../utilities');
const { rethrowError } = require('../error');

const {
  addLayersErrorsHandlers,
  getErrorInput,
  throwMiddlewareError,
} = require('./error');

// Transforms a series of functions into a middleware pipeline.
const fireLayers = async function (middleware, input) {
  // The first layer `final` is special, as it is always fired,
  // whether the request is successful or not.
  const [final, ...main] = middleware;

  try {
    const inputA = await fireLayer(main, 0, input);

    await fireLayer([final], 0, inputA);
  } catch (error) {
    const inputA = getErrorInput(error);

    await fireLayer([final], 0, inputA);

    rethrowError(error);
  }
};

const eFireLayers = addLayersErrorsHandlers(fireLayers);

// Fire all the middleware functions of a given layer
const fireLayer = function (layers, lIndex, input) {
  // Each layer can fire the next layer middleware functions by calling this
  const nextLayer = fireLayer.bind(null, layers, lIndex + 1);
  const fireMiddlewareA = fireMiddleware.bind(null, nextLayer);

  // Iterate over each middleware function
  return reduceAsync(layers[lIndex], fireMiddlewareA, input);
};

// Fire a specific middleware function
const fireMiddleware = function (nextLayer, input, mFunc) {
  try {
    const maybePromise = mFunc(input, nextLayer);

    // Middleware functions can be sync or async
    // We want to avoid async|await in order not to create promises
    // when the middleware is sync, for performance reason
    // eslint-disable-next-line promise/prefer-await-to-then
    return typeof maybePromise.then === 'function'
      ? maybePromise.catch(error => throwMiddlewareError(input, error))
      : maybePromise;
  } catch (error) {
    throwMiddlewareError(input, error);
  }
};

module.exports = {
  fireLayers: eFireLayers,
};
