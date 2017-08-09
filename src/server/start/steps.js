'use strict';

const { getIdl } = require('../../idl');
const { getProcessLog, processErrorHandler } = require('../process');
const { setupGracefulExit } = require('../exit');

const { startServers } = require('./servers');
const { addServerInfo } = require('./server_info');
const { emitStartEvent } = require('./event');

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
  startSteps,
};
