'use strict';

const {
  reduceAsync,
  identity,
  promiseThen,
  keepFuncName,
} = require('../utilities');

const { startPerf, stopPerf } = require('./measure');

// TODO: remove, in favor of monitor()
const oldMonitor = function (func, getLabel = func.name, category) {
  return async function funcAsync (...args) {
    const label = typeof getLabel === 'function' ? getLabel(...args) : getLabel;
    const startedPerf = startPerf(label, category);
    const response = await func(...args);
    const finishedPerf = stopPerf(startedPerf);
    return [response, finishedPerf];
  };
};

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

// Combine oldMonitor() and reduceAsync()
// TODO: do we need this?
const monitoredReduce = function ({
  funcs,
  initialInput,
  mapInput = identity,
  mapResponse = identity,
  label,
  category,
}) {
  return reduceAsync(funcs, async ([input, currentMeasures], func) => {
    const monitoredFunc = oldMonitor(func, label, category);
    // Optional modification of function input
    const funcInput = mapInput(input);
    const [returnValue, measureA] = await monitoredFunc(funcInput);
    // Functions can recursively return their own measures by returning
    // an array [returnValue, responses]
    // This means `monitoredReduce()` cannot be used with functions that
    // would usually return an array, unless they are wrapped in an extra []
    const response = Array.isArray(returnValue) ? returnValue[0] : returnValue;
    const childMeasures = Array.isArray(returnValue)
      ? returnValue[1] || []
      : [];
    // Optional modification of function return value
    const inputA = mapResponse(response, input);

    const measuresA = [...currentMeasures, ...childMeasures, measureA];
    return [inputA, measuresA];
  }, [initialInput, []]);
};

module.exports = {
  oldMonitor,
  monitor: kMonitor,
  monitoredReduce,
};
