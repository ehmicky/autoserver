'use strict';

const { monitoredReduce, oldMonitor, emitPerfEvent } = require('../perf');

const { startupSteps } = require('./steps');
const { handleStartupError } = require('./error');

// Start server for each protocol
// @param {object} runOpts
const runServer = function (runOpts) {
  const funcs = startupSteps.map(step => handleStartupError(step));
  // Monitor each startup step time
  return monitoredReduce({
    funcs,
    initialInput: { runOpts },
    mapResponse: (newInput, input) => ({ ...input, ...newInput }),
    category: 'main',
  });
};

// Monitor total startup time
const mRun = oldMonitor(runServer, 'startup');

// Emit "perf" event with startup performance
const mmRun = async function ({ cliPerf = [], ...opts } = {}) {
  const [[{ startPayload, runOpts }, mainPerf], perf] = await mRun(opts);

  const measures = [...cliPerf, perf, ...mainPerf];
  await emitPerfEvent({ phase: 'startup', measures, runOpts });

  return startPayload;
};

module.exports = {
  run: mmRun,
};
