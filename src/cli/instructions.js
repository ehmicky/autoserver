'use strict';

const { availableInstructions } = require('../instructions');

const { getCliOptions } = require('./options');

// Iterate over `availableOptions` to add all instructions
const addInstructions = function ({ yargs: yargsA }) {
  return availableInstructions.reduce(
    (yargsB, instruction) => addInstruction({ yargs: yargsB, instruction }),
    yargsA,
  );
};

const addInstruction = function ({ yargs: yargsA, instruction }) {
  const cliInstruction = getCliInstruction({ instruction });
  return yargsA.command(cliInstruction);
};

const getCliInstruction = function ({
  instruction,
  instruction: { name, aliases, description },
}) {
  return {
    command: name,
    aliases,
    describe: description,
    builder: yargsA => getBuilder({ instruction, yargs: yargsA }),
  };
};

// Iterate over instruction options
const getBuilder = function ({
  instruction,
  instruction: { description },
  yargs: yargsA,
}) {
  const yargsB = addInstructionExamples({ instruction, yargs: yargsA });
  const cliOptions = getCliOptions({ instruction });
  return yargsB
    .options(cliOptions)
    // Instruction --help header
    .usage(description);
};

// Add examples in top-level --help
const addInstructionsExamples = function ({ yargs: yargsA }) {
  return Object.values(availableInstructions).reduce(
    (yargsB, instruction) =>
      addInstructionExamples({ yargs: yargsB, instruction }),
    yargsA,
  );
};

// Add examples in instruction-level --help
const addInstructionExamples = function ({
  instruction: { name, examples = [] },
  yargs: yargsA,
}) {
  return examples.reduce(
    (yargsB, [desc, usageA]) =>
      yargsB.example(`${desc}:`, `apiengine ${name} ${usageA}`),
    yargsA,
  );
};

module.exports = {
  addInstructions,
  addInstructionsExamples,
};
