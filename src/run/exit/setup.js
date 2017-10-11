'use strict';

const { gracefulExit } = require('./graceful_exit');

// Make sure the server stops when graceful exits are possible
// Also send related events
const setupGracefulExit = function ({ servers, dbAdapters, runOpts }) {
  const gracefulExitA = gracefulExit.bind(
    null,
    { servers, dbAdapters, runOpts },
  );

  process.on('SIGINT', gracefulExitA);
  process.on('SIGTERM', gracefulExitA);

  return { gracefulExit: gracefulExitA };
};

module.exports = {
  setupGracefulExit,
};
