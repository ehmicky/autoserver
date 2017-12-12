'use strict';

const yargs = require('yargs');

const { monitor } = require('../perf');

const { addInstructions } = require('./instructions');
const { processOpts } = require('./process');

// CLI input parsing
const parseInput = function () {
  const opts = parseOpts();

  const { instruction, opts: optsA } = processOpts({ opts });
  return { instruction, opts: optsA };
};

const mParseInput = monitor(parseInput, 'cli');

// CLI options parsing
const parseOpts = function () {
  const yargsA = addInstructions({ yargs });
  return yargsA
    // There should be a single instruction, or none (default one)
    .demandCommand(1, 1)
    // --help option
    .usage(USAGE)
    .help()
    // --version option
    .version()
    .default(['help', 'version'], undefined)
    // Auto-suggests correction on typos
    .recommendCommands()
    .parse();
};

const USAGE = `apiengine [INSTRUCTION] [OPTIONS]

Engine generating an API from a simple config file.
`;

module.exports = {
  parseInput: mParseInput,
};
