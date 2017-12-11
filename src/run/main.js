'use strict';

const { getRequirePerf } = require('../require_perf');
const { monitoredReduce } = require('../perf');
const { addErrorHandler } = require('../error');

const { startupSteps } = require('./steps');
const { handleStartupError } = require('./error');

// Start server for each protocol
const runServer = async function ({
  measures = [],
  config: schemaPath,
  ...schema
} = {}) {
  const requirePerf = getRequirePerf();
  const measuresA = [requirePerf, ...measures];

  // Run each startup step
  const { startPayload } = await monitoredReduce({
    funcs: eStartupSteps,
    initialInput: { measures: measuresA, schemaPath, schema },
    mapResponse: (input, newInput) => ({ ...input, ...newInput }),
    category: 'main',
  });

  return startPayload;
};

// Add startup error handler
const eStartupSteps = startupSteps
  .map(startupStep => addErrorHandler(startupStep, handleStartupError));

module.exports = {
  runServer,
};
