'use strict';

const { monitor, monitoredReduce } = require('../../perf');
const { getIdl } = require('../../idl');
const { getProcessLog, processErrorHandler } = require('../process');
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

const monitoredBootAll = monitor(bootAll, 'all', 'all');

// Each of the steps performed at startup
const startSteps = [
  getProcessLog,
  processErrorHandler,
  addServerInfo,
  getIdl,
  startServers,
  setupGracefulExit,
  emitStartEvent,
];

module.exports = {
  bootAll: monitoredBootAll,
};
