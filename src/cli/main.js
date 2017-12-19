'use strict';

const { exit } = require('process');

const { addErrorHandler } = require('../error');
const instructions = require('../instructions');

const { parseInput } = require('./input');

// Run a server instruction, from the CLI
const startCli = async function () {
  const measures = [];
  const { instruction, opts } = parseInput({ measures });

  await instructions[instruction]({ ...opts, measures });
};

// If an error is thrown, print error's description,
// then exit with exit code 1
const cliErrorHandler = function ({ message, description = message }) {
  // eslint-disable-next-line no-console, no-restricted-globals
  console.error(`Error: ${description}`);

  exit(1);
};

const eStartCli = addErrorHandler(startCli, cliErrorHandler);

module.exports = {
  startCli: eStartCli,
};
