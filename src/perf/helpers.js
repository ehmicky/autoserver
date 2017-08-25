'use strict';

const {
  reduceAsync,
  identity,
  promiseThen,
  keepFuncName,
} = require('../utilities');

const { startPerf, stopPerf } = require('./measure');

// Wraps a function, so it calculate how long the function takes.
const monitor = function (func, label = func.name, category) {
  return function monitoredFunc (...args) {
    const labelA = typeof label === 'function' ? label(...args) : label;
    const perf = startPerf(labelA, category);
    const response = func(...args);
    const [{ measures }] = args;
    return promiseThen(response, recordPerf.bind(null, measures, perf));
  };
};

const kMonitor = keepFuncName(monitor);

const recordPerf = function (measures, perf, response) {
  const perfA = stopPerf(perf);
  // We directly mutate the passed argument, because it greatly simplifies
  // the code
  // eslint-disable-next-line fp/no-mutating-methods
  measures.push(perfA);
  return response;
};

// Combine monitor() and reduceAsync()
const monitoredReduce = function ({
  funcs,
  initialInput,
  mapInput = identity,
  mapResponse = identity,
  label,
  category,
}) {
  const funcsA = funcs.map(func => kMonitor(func, label, category));
  const reduceFunc = monitoredReduceFunc.bind(null, mapInput);
  return reduceAsync(funcsA, reduceFunc, initialInput, mapResponse);
};

const monitoredReduceFunc = function (mapInput, input, func) {
  const inputA = mapInput(input);
  return func(inputA);
};

module.exports = {
  monitor: kMonitor,
  monitoredReduce,
};
