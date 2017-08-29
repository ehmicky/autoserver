'use strict';

const { monitoredReduce } = require('../perf');

const { startupSteps } = require('./steps');
const { handleStartupError } = require('./error');

// Start server for each protocol
// @param {object} runOpts
const runServer = async function ({ measures = [], ...runOpts } = {}) {
  // Run each startup step
  const { startPayload } = await monitoredReduce({
    funcs: eStartupSteps,
    initialInput: { runOpts, measures },
    mapResponse: (input, newInput) => ({ ...input, ...newInput }),
    category: 'main',
  });

  return startPayload;
};

// Add startup error handler
const eStartupSteps = startupSteps.map(handleStartupError);

module.exports = {
  run: runServer,
};
