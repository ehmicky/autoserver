'use strict';

const { getRuntimeOpts } = require('../../runtime_opts');
const { setupGracefulExit } = require('../exit');

const { handleStartupError } = require('./error');
const { processErrorHandler } = require('./process');
const { loadIdlFile } = require('./idl');
const { startServers } = require('./servers');
const { emitStartEvent } = require('./event');

const startupSteps = [
  // Retrieve `runtimeOpts`
  getRuntimeOpts,
  // Setup process warnings and errors handler
  processErrorHandler,
  // Retrieve IDL content
  loadIdlFile,
  // Boot each server
  startServers,
  // Make sure servers are closed on exit
  setupGracefulExit,
  // Emit final "start" event
  emitStartEvent,
].map(step => handleStartupError(step));

module.exports = {
  startupSteps,
};
