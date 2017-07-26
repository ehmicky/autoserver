'use strict';

const { promisify } = require('util');

const { normalizeError, throwError } = require('../error');

const { startPerf, stopPerf } = require('./measure');

// Generic middleware that performs performance logging before each middleware
const getMiddlewarePerfLog = func => async function middlewarePerfLog (
  nextFunc,
  input,
  ...args
) {
  return await nextFunc(input, ...args);

  const startedPerf = start({ func, input });

  try {
    const response = await nextFunc(input, ...args);
    const finishedPerf = await stop({ perf: startedPerf });
    const currentPerf = response.perf || [];
    const newPerf = [...currentPerf, finishedPerf];
    const newResponse = Object.assign({}, response, { perf: newPerf });
    return newResponse;
  } catch (error) {
    const errorObj = normalizeError({ error });

    const finishedPerf = await stop({ perf: startedPerf });
    const currentPerf = error.perf || [];
    const newPerf = [...currentPerf, finishedPerf];
    const newError = Object.assign({}, errorObj, { perf: newPerf });
    throwError({ error: newError });
  }
};

// TODO: difference between middleware

const start = function ({ func, input }) {
  // When a middleware is simply a "switch", we try to get the selected
  // function's name instead
  const nextFunc = (func.getMiddleware && func.getMiddleware(input)) || func;

  const startedPerf = startPerf(nextFunc.name, 'middleware');
  return startedPerf;
};

const stop = async function ({ perf }) {
  const finishedPerf = stopPerf(perf);

  // When performing await middlewarePerfLog(),
  // `await` might yield the current macrotask, i.e. the parentPerf will be
  // restarted, but another macrotask will be run first, although the parent
  // is still waiting.
  // Forcing to wait for the current macrotask to end mitigates that problem,
  // although it still exists, and concurrent measures might have their reported
  // time inflated by the time they waited for the concurrent tasks
  // to complete.
  await promisify(setTimeout)(0);

  return finishedPerf;
};

module.exports = {
  getMiddlewarePerfLog,
};
