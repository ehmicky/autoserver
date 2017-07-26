'use strict';

const { reduceAsync, identity } = require('../utilities');

const { startPerf, stopPerf } = require('./measure');

const monitor = function (func, getLabel = func.name, category) {
  return async function funcAsync (...args) {
    const label = typeof getLabel === 'function' ? getLabel(...args) : getLabel;
    const startedPerf = startPerf(label, category);
    const response = await func(...args);
    const finishedPerf = stopPerf(startedPerf);
    return [response, finishedPerf];
  };
};

const monitoredReduce = function ({
  funcs,
  initialInput,
  mapResponse = identity,
  label,
  category,
}) {
  return reduceAsync(funcs, async ([input, currentMeasures], func) => {
    const monitoredFunc = monitor(func, label, category);
    const [returnValue, newMeasure] = await monitoredFunc(input);
    const response = Array.isArray(returnValue) ? returnValue[0] : returnValue;
    const childMeasures = Array.isArray(returnValue) ? returnValue[1] : [];
    const newInput = mapResponse(response, input);

    const nextMeasures = [...currentMeasures, ...childMeasures, newMeasure];
    return [newInput, nextMeasures];
  }, [initialInput, []]);
};

module.exports = {
  monitor,
  monitoredReduce,
};
