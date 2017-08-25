'use strict';

const instructions = require('../instructions');

const { parseInput } = require('./input');

// Run a server instruction, from the CLI
const startCli = function () {
  // eslint-disable-next-line fp/no-mutation
  Error.stackTraceLimit = 100;

  const measures = [];
  const { instruction, opts } = parseInput({ measures });

  instructions[instruction]({ ...opts, measures })
    // eslint-disable-next-line no-process-exit, unicorn/no-process-exit
    .catch(() => process.exit(1));
};

module.exports = {
  startCli,
};
