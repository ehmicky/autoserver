'use strict';

const { reduceAsync } = require('../utilities');
const { addIfv } = require('../idl_func');

const {
  addLayersErrorsHandlers,
  addMiddlewareHandler,
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
    const inputA = getErrorInput({ error });

    const inputB = await fireLayer([final], 0, inputA);

    throwMiddlewareError(error, inputB, { force: true });
  }
};

const eFireLayers = addLayersErrorsHandlers(fireLayers);

// Fire all the middleware functions of a given layer
const fireLayer = function (layers, lIndex, input) {
  // Each layer can fire the next layer middleware functions by calling this
  const nextLayer = fireLayer.bind(null, layers, lIndex + 1);
  const fireMiddlewareA = eFireMiddleware.bind(null, nextLayer);

  // Iterate over each middleware function
  return reduceAsync(layers[lIndex], fireMiddlewareA, input, mergeInput);
};

// Fire a specific middleware function
const fireMiddleware = function (nextLayer, input, mFunc) {
  return mFunc(input, nextLayer);
};

// We merge the return value of each middleware (`input`)
// with the current input (`inputA`)
const mergeInput = function (input, inputA = {}) {
  const ifv = getIfv(input, inputA);
  return { ...input, ...inputA, ifv };
};

const getIfv = function ({ ifv }, { ifvParams: ifvA, ifv: ifvB }) {
  if (ifvB) { return ifvB; }
  if (!ifvA) { return ifv; }
  return addIfv(ifv, ifvA);
};

const eFireMiddleware = addMiddlewareHandler.bind(null, fireMiddleware);

module.exports = {
  fireLayers: eFireLayers,
};
