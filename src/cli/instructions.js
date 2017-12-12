'use strict';

const { availableInstructions } = require('./available');

// Iterate over `availableOptions` to add all instructions
const addInstructions = function ({ yargs }) {
  return availableInstructions.reduce(
    (yargsA, instruction) => addInstruction({ yargs: yargsA, instruction }),
    yargs,
  );
};

const addInstruction = function ({ yargs, instruction }) {
  const cliInstruction = getCliInstruction({ instruction });
  return yargs.command(cliInstruction);
};

const getCliInstruction = function ({
  instruction,
  instruction: { name, aliases, describe: desc },
}) {
  return {
    command: name,
    aliases,
    describe: desc,
    builder: yargs => getBuilder({ instruction, yargs }),
  };
};

// Iterate over instruction options
const getBuilder = function ({
  instruction,
  instruction: { describe: desc, options = {} },
  yargs,
}) {
  const yargsA = addInstructionExamples({ instruction, yargs });
  const yargsB = yargsA
    // Instruction --help header
    .usage(desc)
    // Non-positional arguments
    .option(options)
    // Positional arguments
    .positional('instruction', INSTRUCTION_OPT);
  const yargsC = addPositionalArgs({ instruction, yargs: yargsB });
  return yargsC;
};

const INSTRUCTION_OPT = {
  type: 'string',
  default: 'run',
};

// Add examples in instruction-level --help
const addInstructionExamples = function ({
  instruction: { name, examples = [] },
  yargs,
}) {
  return examples.reduce(
    (yargsA, [desc, usageA]) =>
      yargsA.example(`${desc}:`, `apiengine ${name} ${usageA}`),
    yargs,
  );
};

const addPositionalArgs = function ({ instruction: { args = [] }, yargs }) {
  return args.reduce(
    (yargsA, { name, ...arg }) => yargsA.positional(name, arg),
    yargs,
  );
};

module.exports = {
  addInstructions,
};
