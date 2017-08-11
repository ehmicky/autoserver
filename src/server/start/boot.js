'use strict';

const { monitoredReduce } = require('../../perf');
const { setupGracefulExit } = require('../exit');

const { processErrorHandler } = require('./process');
const { loadIdlFile } = require('./idl');
const { startServers } = require('./servers');
const { emitStartEvent } = require('./event');

const bootAll = function (initialInput) {
  return monitoredReduce({
    funcs: startSteps,
    initialInput,
    mapResponse: (newInput, input) => ({ ...input, ...newInput }),
  });
};

// Each of the steps performed at startup
const startSteps = [
  processErrorHandler,
  loadIdlFile,
  startServers,
  setupGracefulExit,
  emitStartEvent,
];

module.exports = {
  bootAll,
};
