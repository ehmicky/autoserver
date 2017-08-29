'use strict';

const { onlyOnce } = require('../../utilities');

const { gracefulExit } = require('./graceful_exit');

// Make sure the server stops when graceful exits are possible
// Also send related events
const setupGracefulExit = function ({ servers, runOpts }) {
  const gracefulExitA = gracefulExit.bind(null, { servers, runOpts });
  const gracefulExitB = onlyOnce(gracefulExitA);

  process.on('SIGINT', gracefulExitB);
  process.on('SIGTERM', gracefulExitB);

  return { gracefulExit: gracefulExitB };
};

module.exports = {
  setupGracefulExit,
};
