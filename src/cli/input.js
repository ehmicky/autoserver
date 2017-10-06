'use strict';

const yargs = require('yargs');

const { availableInstructions } = require('../options');
const { monitor } = require('../perf');

const { addInstructions, addInstructionsExamples } = require('./instructions');
const { cleanOpts } = require('./clean');

// CLI input parsing
const parseInput = function () {
  const opts = parseOpts();
  const optsA = cleanOpts({ opts });
  const { instruction, opts: optsB } = parseInstruction({ opts: optsA });
  return { instruction, opts: optsB };
};

// Performance monitoring
const mParseInput = monitor(parseInput, 'cli');

// CLI options parsing
const parseOpts = function () {
  const yargsA = addInstructions({ yargs });
  const yargsB = addInstructionsExamples({ yargs: yargsA });
  return yargsB
    // There should be a single instruction, or none (default one)
    .demandCommand(1, 1)
    // No unknown instruction nor options
    .strict()
    // Used in --help option
    .usage(usage)
    // `completion` instruction, which outputs Bash completion script
    .completion('completion', 'Generate a Bash completion script')
    // Auto-suggests correction on typos
    .recommendCommands()
    .argv;
};

const usage = `apiengine INSTRUCTION [OPTIONS]

Engine generating an API from a simple configuration file.`;

// Retrieve CLI instruction
const parseInstruction = function ({ opts: { _: instructions, ...optsA } }) {
  const instructionNames = availableInstructions.map(({ name }) => name);

  // If the instruction is wrong, or missing, defaults to 'run'
  const missingInstruction = !Array.isArray(instructions) ||
    instructions.length !== 1 ||
    !instructionNames.includes(instructions[0]);
  const instruction = missingInstruction ? 'run' : instructions[0];

  return { instruction, opts: optsA };
};

module.exports = {
  parseInput: mParseInput,
};
