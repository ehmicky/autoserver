'use strict';

const { getRunOpts } = require('./options');
const { processErrorHandler } = require('./process');
const { startServers } = require('./servers');
const { setupGracefulExit } = require('./exit');
const { emitStartEvent } = require('./start_event');

const startupSteps = [
  // Retrieve `runOpts`
  getRunOpts,
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
