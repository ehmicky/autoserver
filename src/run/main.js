'use strict';

const { getRequirePerf } = require('../require_perf');
const { monitoredReduce, stopPerf } = require('../perf');

const { startupSteps } = require('./steps');
const { handleStartupError } = require('./error');

// Start server for each protocol
// @param {object} runOpts
const runServer = async function ({ measures = [], ...runOpts } = {}) {
  const measuresA = addRequirePerf({ measures });

  // Run each startup step
  const { startPayload } = await monitoredReduce({
    funcs: eStartupSteps,
    initialInput: { runOpts, measures: measuresA },
    mapResponse: (input, newInput) => ({ ...input, ...newInput }),
    category: 'main',
  });

  return startPayload;
};

const addRequirePerf = function ({ measures }) {
  const requirePerf = getRequirePerf();
  const requirePerfA = stopPerf(requirePerf);
  return [requirePerfA, ...measures];
};

// Add startup error handler
const eStartupSteps = startupSteps.map(handleStartupError);

module.exports = {
  run: runServer,
};
