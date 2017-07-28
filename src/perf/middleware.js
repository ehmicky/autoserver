'use strict';

const { pSetTimeout } = require('../utilities');

const { startPerf, stopPerf, restartPerf } = require('./measure');

// Generic middleware that performs performance logging before each middleware
const getMiddlewarePerfLog = func => async function middlewarePerfLog (
  nextFunc,
  input,
  ...args
) {
  // Freeze parent `currentPerf`
  const parentPerf = input.currentPerf;
  // `parentPerf` is undefined in the first middleware
  const stoppedParentPerf = parentPerf && stopPerf(parentPerf);

  const { response, measures } = await fireMiddleware({
    func,
    nextFunc,
    input,
    args,
  });

  // When performing await middlewarePerfLog(),
  // `await` might yield the current macrotask, i.e. the parentPerf will be
  // restarted, but another macrotask will be run first, although the parent
  // is still waiting.
  // Forcing to wait for the current macrotask to end mitigates that problem,
  // although it still exists, and concurrent measures might have their reported
  // time inflated by the time they waited for the concurrent tasks
  // to complete.
  await pSetTimeout(0);
  // Unfreeze parent `currentPerf`
  const restartedParentPerf = parentPerf && restartPerf(stoppedParentPerf);

  const newResponse = Object.assign(
    {},
    response,
    { measures, currentPerf: restartedParentPerf },
  );
  return newResponse;
};

// Execute next middleware, while calculating performance measures
const fireMiddleware = async function ({ func, nextFunc, input, args }) {
  // Start middleware performance
  const currentPerf = startPerf(func.name, 'middleware');

  // Pass `currentPerf` as argument so it can be frozen by its children
  const nextInput = Object.assign({}, input, { currentPerf });
  const response = await nextFunc(nextInput, ...args) || {};

  // Add `currentPerf` to `response.measures` array
  const {
    measures: currentMeasures = [],
    currentPerf: currentMeasure = currentPerf,
  } = response;

  // Stops middleware performance
  const finishedMeasure = stopPerf(currentMeasure);

  const measures = [...currentMeasures, finishedMeasure];
  return { response, measures };
};

module.exports = {
  getMiddlewarePerfLog,
};
