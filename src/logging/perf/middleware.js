'use strict';

const { promisify } = require('util');

// Generic middleware that performs performance logging before each middleware
const getMiddlewarePerfLog = func => async function middlewarePerfLog (
  input,
  ...args
) {
  const { log } = input;

  // E.g. for the first middleware
  if (!log) { return this.next(input, ...args); }

  const perf = startPerf({ func, input });

  try {
    const nextInput = Object.assign({}, input, { perf });
    const response = await this.next(nextInput);

    await stopPerf({ input, perf });

    return response;
  // Make sure it is always called
  } catch (error) {
    await stopPerf({ input, perf });

    throw error;
  }
};

const startPerf = function ({ func, input, input: { log } }) {
  stopParent(input);

  // When a middleware is simply a "switch", we try to get the selected
  // function's name instead
  const nextFunc = (func.getMiddleware && func.getMiddleware(input)) || func;

  const perf = log.perf.start(nextFunc.name, 'middleware');
  return perf;
};

const stopPerf = async function ({ input, perf }) {
  perf.stop();

  // When performing await middlewarePerfLog(),
  // `await` might yield the current macrotask, i.e. the parentPerf will be
  // restarted, but another macrotask will be run first, although the parent
  // is still waiting.
  // Forcing to wait for the current macrotask to end mitigates that problem,
  // although it still exists, and concurrent items might have their reported
  // time inflated by the time they waited for the concurrent tasks
  // to complete.
  await promisify(setTimeout)(0);

  restartParent(input);
};

const stopCounter = new WeakMap();

// Middleware performance loggers are exclusive.
// When one starts, another stops, and vice-versa
const stopParent = function ({ perf: parentPerf }) {
  if (!parentPerf) { return; }

  // One middleware can spur several children in parallel.
  // If so, we stop the current middleware performance runner on the first
  // child that starts, and restart on the last child that stops
  const counter = stopCounter.get(parentPerf) || 0;
  stopCounter.set(parentPerf, counter + 1);

  if (counter > 0) { return; }

  parentPerf.stop();
};

const restartParent = function ({ perf: parentPerf }) {
  if (!parentPerf) { return; }

  const counter = stopCounter.get(parentPerf);
  stopCounter.set(parentPerf, counter - 1);

  if (counter > 1) { return; }

  parentPerf.start();
};

module.exports = {
  getMiddlewarePerfLog,
};
