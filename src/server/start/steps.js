'use strict';

const { setupGracefulExit } = require('../exit');

const { getRuntimeOpts } = require('./runtime_opts');
const { processErrorHandler } = require('./process');
const { startServers } = require('./servers');
const { emitStartEvent } = require('./event');

const startupSteps = [
  // Retrieve `runtimeOpts`
  getRuntimeOpts,
  // Setup process warnings and errors handler
  processErrorHandler,
  // Boot each server
  startServers,
  // Make sure servers are closed on exit
  setupGracefulExit,
  // Emit final "start" event
  emitStartEvent,
];

module.exports = {
  startupSteps,
};
