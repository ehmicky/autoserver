'use strict';

const { getRunOpts } = require('./options');
const { processErrorHandler } = require('./process');
const { bootServers } = require('./boot');
const { setupGracefulExit } = require('./exit');

const startupSteps = [
  // Retrieve `runOpts`
  getRunOpts,
  // Setup process warnings and errors handler
  processErrorHandler,
  // Boot each server
  bootServers,
  // Make sure servers are closed on exit
  setupGracefulExit,
];

module.exports = {
  startupSteps,
};
