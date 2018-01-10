'use strict';

const process = require('process');

const { gracefulExit } = require('./graceful_exit');

// Make sure the server stops when graceful exits are possible
// Also send related events
const setupGracefulExit = function ({ protocolAdapters, dbAdapters, config }) {
  const exitFunc = gracefulExit.bind(
    null,
    { protocolAdapters, dbAdapters, config },
  );

  process.on('SIGINT', exitFunc);
  process.on('SIGTERM', exitFunc);
  // For Nodemon
  process.on('SIGUSR2', exitFunc);

  return { exitFunc };
};

module.exports = {
  setupGracefulExit,
};
