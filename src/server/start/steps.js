'use strict';

const { getRuntimeOpts } = require('../../runtime_opts');
const { setupGracefulExit } = require('../exit');

const { handleLateStartupError } = require('./error');
const { processErrorHandler } = require('./process');
const { loadIdlFile } = require('./idl');
const { startServers } = require('./servers');
const { emitStartEvent } = require('./event');

// List of steps to start all the servers
const getStartupSteps = () => [
  ...earlySteps,
  ...lateSteps,
];

const earlySteps = [
  // Retrieve `runtimeOpts`
  getRuntimeOpts,
  // Setup process warnings and errors handler
  processErrorHandler,
  // Retrieve IDL content
  loadIdlFile,
  // Boot each server
  startServers,
];

const lateSteps = [
  // Make sure servers are closed on exit
  setupGracefulExit,
  // Emit final "start" event
  emitStartEvent,
// Late steps are performed after server have started,
// i.e. must add an error handler to close those servers if an exception is
// thrown
].map(step => handleLateStartupError(step));

module.exports = {
  getStartupSteps,
};
