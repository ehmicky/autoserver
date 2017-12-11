'use strict';

const yargs = require('yargs');

const { monitor } = require('../perf');
const { DESCRIPTION } = require('../formats');

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
    .argv;
};

const USAGE = `apiengine INSTRUCTION [SCHEMA_FILE] [OPTIONS]


Engine generating an API from a simple configuration file.

SCHEMA_FILE is the path to the schema file.
The following formats are available: ${DESCRIPTION}.
By default, any file named 'apiengine.config.EXTENSION' will be used.

OPTIONS can be any schema property, dot-separated.
For example: --protocols.http.port=5001

`;

module.exports = {
  parseInput: mParseInput,
};
