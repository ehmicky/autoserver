'use strict';

const instructions = require('../instructions');

const { parseInput } = require('./input');

// Run a server instruction, from the CLI
const startCli = function () {
  // eslint-disable-next-line fp/no-mutation
  Error.stackTraceLimit = 100;

  const [{ instruction, opts }, cliPerf] = parseInput();
  const optsA = { ...opts, cliPerf };

  instructions[instruction](optsA)
    // eslint-disable-next-line no-process-exit, unicorn/no-process-exit
    .catch(() => process.exit(1));
};

module.exports = {
  startCli,
};
