'use strict';

const yargs = require('yargs');

const { availableCommands } = require('../options');
const { startPerf, stopPerf } = require('../perf');

const { addCommands, addCommandsExamples } = require('./commands');
const { cleanOpts } = require('./clean');

// CLI input parsing
const parseInput = function () {
  const opts = parseOpts();
  const optsA = cleanOpts({ opts });
  const { command, opts: optsB } = parseCommand({ opts: optsA });
  return { command, opts: optsB };
};

// Performance monitoring
const mParseInput = function () {
  const startedPerf = startPerf('parseInput', 'main');
  const response = parseInput();
  const finishedPerf = stopPerf(startedPerf);
  return [response, [finishedPerf]];
};

// CLI options parsing
const parseOpts = function () {
  const yargsA = addCommands({ yargs });
  const yargsB = addCommandsExamples({ yargs: yargsA });
  return yargsB
    // There should be a single command, or none (default one)
    .demandCommand(1, 1)
    // No unknown commands nor options
    .strict()
    // --help option
    .usage(usage)
    .help()
    // --version option
    .version()
    .default(['help', 'version'], undefined)
    // `completion` command, which outputs Bash completion script
    .completion()
    // Auto-suggests correction on typos
    .recommendCommands()
    .argv;
};

const usage = `apiengine COMMAND [OPTIONS]

Engine generating an API from a simple configuration file.`;

// Retrieve CLI command
const parseCommand = function ({ opts: { _: commands, ...optsA } }) {
  const commandNames = availableCommands.map(({ name }) => name);

  // If the command is wrong, or missing, defaults to 'run'
  const missingCommand = !Array.isArray(commands) ||
    commands.length !== 1 ||
    !commandNames.includes(commands[0]);
  const command = missingCommand ? 'run' : commands[0];

  return { command, opts: optsA };
};

module.exports = {
  parseInput: mParseInput,
};
