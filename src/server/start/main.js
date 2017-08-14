'use strict';

const { monitoredReduce, monitor, emitPerfEvent } = require('../../perf');

const { startupSteps } = require('./steps');
const { handleStartupError } = require('./error');

// Start server for each protocol
// @param {object} runtimeOpts
const start = function ({ runtime: runtimeOptsFile, idl: idlFile } = {}) {
  const funcs = startupSteps.map(step => handleStartupError(step));
  // Monitor each startup step time
  return monitoredReduce({
    funcs,
    initialInput: { runtimeOptsFile, idlFile },
    mapResponse: (newInput, input) => ({ ...input, ...newInput }),
    category: 'main',
  });
};

// Monitor total startup time
const mStart = monitor(start, 'startup');

// Emit "perf" event with startup performance
const mmStart = async function (opts) {
  const [[{ startPayload, runtimeOpts }, mainPerf], perf] = await mStart(opts);

  const measures = [perf, ...mainPerf];
  await emitPerfEvent({ phase: 'startup', measures, runtimeOpts });

  return startPayload;
};

module.exports = {
  start: mmStart,
};
