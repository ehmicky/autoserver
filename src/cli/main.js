'use strict';

const { addErrorHandler } = require('../error');
const instructions = require('../instructions');

const { parseInput } = require('./input');

// Run a server instruction, from the CLI
const startCli = async function () {
  // eslint-disable-next-line fp/no-mutation
  Error.stackTraceLimit = 100;

  const measures = [];
  const { instruction, opts } = parseInput({ measures });

  await instructions[instruction]({ ...opts, measures });
};

// If an error is thrown, print error's description,
// then exit with exit code 1
const cliErrorHandler = function ({ description }) {
  // eslint-disable-next-line no-console, no-restricted-globals
  console.error(`Error: ${description}`);

  // eslint-disable-next-line no-process-exit, unicorn/no-process-exit
  process.exit(1);
};

const eStartCli = addErrorHandler(startCli, cliErrorHandler);

module.exports = {
  startCli: eStartCli,
};
