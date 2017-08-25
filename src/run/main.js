'use strict';

const { monitor, newMonitoredReduce, emitPerfEvent } = require('../perf');

const { startupSteps } = require('./steps');
const { handleStartupError } = require('./error');

// Start server for each protocol
// @param {object} runOpts
const runServer = function ({ runOpts, measures }) {
  // Add startup error handler
  const funcs = startupSteps.map(handleStartupError);

  // Run each startup step
  return newMonitoredReduce({
    funcs,
    initialInput: { runOpts, measures },
    mapResponse: (input, newInput) => ({ ...input, ...newInput }),
    category: 'main',
  });
};

// Monitor total startup time
const mRun = monitor(runServer, 'startup');

// Emit "perf" event with startup performance
const mmRun = async function ({ measures = [], ...runOpts } = {}) {
  const { startPayload, runOpts: runOptsA } = await mRun({ runOpts, measures });

  await emitPerfEvent({ phase: 'startup', measures, runOpts: runOptsA });

  return startPayload;
};

module.exports = {
  run: mmRun,
};
