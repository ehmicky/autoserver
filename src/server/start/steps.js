'use strict';

const { getIdl } = require('../../idl');
const { getProcessLog, processErrorHandler } = require('../process');
const { handleOptions } = require('../options');
const { setupGracefulExit } = require('../exit');

const { startServers } = require('./servers');
const { emitStartEvent } = require('./event');

// Each of the steps performed at startup
const startSteps = [
  getProcessLog,
  processErrorHandler,
  handleOptions,
  getIdl,
  startServers,
  setupGracefulExit,
  emitStartEvent,
];

module.exports = {
  startSteps,
};
