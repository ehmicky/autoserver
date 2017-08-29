'use strict';

const {
  startStartupPerf,
  stopStartupPerf,
  reportStartupPerf,
} = require('./perf');
const { getRunOpts } = require('./options');
const { processErrorHandler } = require('./process');
const { bootServers } = require('./boot');
const { setupGracefulExit } = require('./exit');
const { emitStartEvent } = require('./start_event');

const startupSteps = [
  // Start monitoring main startup time
  startStartupPerf,
  // Retrieve `runOpts`
  getRunOpts,
  // Setup process warnings and errors handler
  processErrorHandler,
  // Boot each server
  bootServers,
  // Make sure servers are closed on exit
  setupGracefulExit,
  // Stop monitoring main startup time
  stopStartupPerf,
  // Emit 'start' event
  emitStartEvent,
  // Report startup performance monitoring
  reportStartupPerf,
];

module.exports = {
  startupSteps,
};
