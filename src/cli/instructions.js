'use strict';

const availableInstructions = require('./available');

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
  instruction: { name, aliases, description },
}) {
  return {
    command: name,
    aliases,
    describe: description,
    builder: yargs => getBuilder({ instruction, yargs }),
  };
};

// Iterate over instruction options
const getBuilder = function ({
  instruction,
  instruction: { description },
  yargs,
}) {
  const yargsA = addInstructionExamples({ instruction, yargs });
  // Instruction --help header
  return yargsA.usage(description);
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

module.exports = {
  addInstructions,
};
