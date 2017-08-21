'use strict';

const { startPerf, stopPerf, restartPerf } = require('./measure');

// Generic middleware that performs performance events before each middleware
const getMiddlewarePerf = func => async function middlewarePerf (
  nextFunc,
  input,
  ...args
) {
  // Freeze parent `currentPerf`
  const parentPerf = input.currentPerf;
  // `parentPerf` is undefined in the first middleware
  const stoppedParentPerf = parentPerf && stopPerf(parentPerf);

  const { input: inputA, measures } = await fireMiddleware({
    func,
    nextFunc,
    input,
    args,
  });

  // Unfreeze parent `currentPerf`
  const restartedParentPerf = parentPerf && restartPerf(stoppedParentPerf);

  const responseA = {
    ...inputA.response,
    measures,
    currentPerf: restartedParentPerf,
  };
  return { ...inputA, response: responseA };
};

// Execute next middleware, while calculating performance measures
const fireMiddleware = async function ({ func, nextFunc, input, args }) {
  // Start middleware performance
  const currentPerf = startPerf(func.name, 'middleware');

  // Pass `currentPerf` as argument so it can be frozen by its children
  const inputA = { ...input, currentPerf };
  const inputB = await nextFunc(inputA, ...args) || {};

  // Add `currentPerf` to `response.measures` array
  const {
    response: {
      measures: currentMeasures = [],
      currentPerf: currentMeasure = currentPerf,
    } = {},
  } = inputB;

  // Stops middleware performance
  const finishedMeasure = stopPerf(currentMeasure);

  const measures = [...currentMeasures, finishedMeasure];
  return { input: inputB, measures };
};

module.exports = {
  getMiddlewarePerf,
};
