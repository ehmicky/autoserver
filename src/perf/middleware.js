'use strict';

const { promiseThen } = require('../utilities');

const { startPerf, stopPerf } = require('./measure');

// Add performance monitoring to every request.
// Calculate how much time each middleware takes,
// and push measurement to `reqState.measures` array.
const monitorAllLayers = function (allLayers) {
  return allLayers.map(monitorLayers);
};

const monitorLayers = function ({ layers, name, ...rest }) {
  const monitorLayerA = monitorLayer.bind(null, name);
  const layersA = layers.map(mFunc => monitorLayerA.bind(null, mFunc));
  return { layers: layersA, name, ...rest };
};

// eslint-disable-next-line max-params
const monitorLayer = function (layerName, mFunc, mInput, nextLayer, reqState) {
  const perf = startMiddlewarePerf(mFunc, layerName);
  const mInputA = mFunc(mInput, nextLayer, reqState);
  return promiseThen(mInputA, stopMiddlewarePerf.bind(null, perf, reqState));
};

const startMiddlewarePerf = function (mFunc, layerName) {
  return startPerf(mFunc.name, layerName);
};

const stopMiddlewarePerf = function (perf, reqState, mInput) {
  const perfA = stopPerf(perf);
  // We directly mutate `reqState` because it greatly simplify the code
  // eslint-disable-next-line fp/no-mutation, no-param-reassign
  reqState.measures = reqState.measures || [];
  // eslint-disable-next-line fp/no-mutating-methods
  reqState.measures.push(perfA);

  return mInput;
};

module.exports = {
  monitorAllLayers,
};
