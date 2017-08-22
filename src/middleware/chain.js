'use strict';

const { reduceAsync } = require('../utilities');

const { addLayersErrorsHandlers, throwMiddlewareError } = require('./error');

// Transforms a series of functions into a middleware pipeline.
const getChain = function ({ main }) {
  return eFireLayer.bind(null, { main }, 0);
};

// Fire all the middleware functions of a given layer
const fireLayer = function ({ main }, lIndex, input) {
  // Each layer can fire the next layer middleware functions by calling this
  const nextLayer = fireLayer.bind(null, { main }, lIndex + 1);
  const fireMiddlewareA = fireMiddleware.bind(null, nextLayer);

  // Iterate over each middleware function
  return reduceAsync(main[lIndex], fireMiddlewareA, input);
};

const eFireLayer = addLayersErrorsHandlers(fireLayer);

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
  getChain,
};
