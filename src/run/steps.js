'use strict';

const { getServerInfo } = require('../server_info');
const { getRequestHandler } = require('../middleware');

const {
  startStartupPerf,
  stopStartupPerf,
  reportStartupPerf,
} = require('./perf');
const { getRunOpts } = require('./options');
const { processErrorHandler } = require('./process');
const { parseIdl } = require('./idl');
const { launchServers } = require('./launch');
const { setupGracefulExit } = require('./exit');
const { emitStartEvent } = require('./start_event');

const startupSteps = [
  // Start monitoring main startup time
  startStartupPerf,
  // Retrieve `runOpts`
  getRunOpts,
  // Setup process warnings and errors handler
  processErrorHandler,
  // Parse IDL file
  parseIdl,
  // Retrieve server information
  getServerInfo,
  // Get main request handler
  getRequestHandler,
  // Boot each server
  launchServers,
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
