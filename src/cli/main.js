'use strict';

const commands = require('../commands');

const { parseInput } = require('./input');

// Run a server command, from the CLI
const startCli = function () {
  // eslint-disable-next-line fp/no-mutation
  Error.stackTraceLimit = 100;

  const { command, opts } = parseInput();

  commands[command](opts)
    // eslint-disable-next-line no-process-exit, unicorn/no-process-exit
    .catch(() => process.exit(1));
};

module.exports = {
  startCli,
};
