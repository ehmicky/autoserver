'use strict';

const { monitoredReduce, monitor, emitPerfEvent } = require('../../perf');

const { startupSteps } = require('./steps');
const { handleStartupError } = require('./error');

// Start server for each protocol
// @param {object} runtimeOpts
const runServer = function (runtimeOpts = {}) {
  const funcs = startupSteps.map(step => handleStartupError(step));
  // Monitor each startup step time
  return monitoredReduce({
    funcs,
    initialInput: { runtimeOpts },
    mapResponse: (newInput, input) => ({ ...input, ...newInput }),
    category: 'main',
  });
};

// Monitor total startup time
const mRun = monitor(runServer, 'startup');

// Emit "perf" event with startup performance
const mmRun = async function (opts) {
  const [[{ startPayload, runtimeOpts }, mainPerf], perf] = await mRun(opts);

  const measures = [perf, ...mainPerf];
  await emitPerfEvent({ phase: 'startup', measures, runtimeOpts });

  return startPayload;
};

module.exports = {
  run: mmRun,
};
