'use strict';

const { gracefulExit } = require('./graceful_exit');

// Make sure the server stops when graceful exits are possible
// Also send related events
const setupGracefulExit = function ({ protocols, dbAdapters, config }) {
  const gracefulExitA = gracefulExit
    .bind(null, { protocols, dbAdapters, config });

  process.on('SIGINT', gracefulExitA);
  process.on('SIGTERM', gracefulExitA);
  // For Nodemon
  process.on('SIGUSR2', gracefulExitA);

  return { gracefulExit: gracefulExitA };
};

module.exports = {
  setupGracefulExit,
};
