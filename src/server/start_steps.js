'use strict';

const { processOptions } = require('../options');
const { getIdl } = require('../idl');
const { addCustomKeywords } = require('../validation');

const { processErrorHandler } = require('./process');
const { startServers } = require('./servers');
const { setupGracefulExit } = require('./exit');
const { emitStartEvent } = require('./start_event');

// Each of the steps performed at startup
const startSteps = [
  processErrorHandler,
  processOptions,
  getIdl,
  addCustomKeywords,
  startServers,
  setupGracefulExit,
  emitStartEvent,
];

module.exports = {
  startSteps,
};
