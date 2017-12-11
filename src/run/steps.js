'use strict';

const { getRequestHandler } = require('../middleware');
const { loadSchema } = require('../schema');

const {
  startStartupPerf,
  stopStartupPerf,
  reportStartupPerf,
} = require('./perf');
const { processErrorHandler } = require('./process');
const { connectToDatabases } = require('./database');
const { setupGracefulExit } = require('./exit');
const { launchProtocols } = require('./protocols');
const { emitStartEvent } = require('./start_event');

const startupSteps = [
  // Start monitoring main startup time
  startStartupPerf,
  // Loads schema
  loadSchema,
  // Setup process warnings and errors handler
  processErrorHandler,
  // Create database connections
  connectToDatabases,
  // Get main request handler
  getRequestHandler,
  // Boot each protocol-specific server
  launchProtocols,
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
