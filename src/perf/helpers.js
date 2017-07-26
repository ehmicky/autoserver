'use strict';

const { reduceAsync, identity } = require('../utilities');

const { startPerf, stopPerf } = require('./measure');

// Wraps a function, so it calculate how long the function takes.
// Returns the information by wrapping the return value as an array,
// with the first element being the normal return value, and the second being
// the measure
const monitor = function (func, getLabel = func.name, category) {
  return async function funcAsync (...args) {
    const label = typeof getLabel === 'function' ? getLabel(...args) : getLabel;
    const startedPerf = startPerf(label, category);
    const response = await func(...args);
    const finishedPerf = stopPerf(startedPerf);
    return [response, finishedPerf];
  };
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
  return reduceAsync(funcs, async ([input, currentMeasures], func) => {
    const monitoredFunc = monitor(func, label, category);
    // Optional modification of function input
    const funcInput = mapInput(input);
    const [returnValue, newMeasure] = await monitoredFunc(funcInput);
    // Functions can recursively return their own measures by returning
    // an array [returnValue, responses]
    // This means `monitoredReduce()` cannot be used with functions that
    // would usually return an array, unless they are wrapped in an extra []
    const response = Array.isArray(returnValue) ? returnValue[0] : returnValue;
    const childMeasures = Array.isArray(returnValue)
      ? returnValue[1] || []
      : [];
    // Optional modification of function return value
    const newInput = mapResponse(response, input);

    const nextMeasures = [...currentMeasures, ...childMeasures, newMeasure];
    return [newInput, nextMeasures];
  }, [initialInput, []]);
};

module.exports = {
  monitor,
  monitoredReduce,
};
