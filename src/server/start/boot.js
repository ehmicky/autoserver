'use strict';

const { monitoredReduce } = require('../../perf');
const { getProcessLog, processErrorHandler } = require('../process');
const { loadIdlFile } = require('../idl');
const { setupGracefulExit } = require('../exit');

const { startServers } = require('./servers');
const { addServerInfo } = require('./server_info');
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
  getProcessLog,
  processErrorHandler,
  addServerInfo,
  loadIdlFile,
  startServers,
  setupGracefulExit,
  emitStartEvent,
];

module.exports = {
  bootAll,
};
