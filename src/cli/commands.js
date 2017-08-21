'use strict';

const { availableCommands } = require('../options');

const { getCliOptions } = require('./options');

// Iterate over `availableOptions` to add all commands
const addCommands = function ({ yargs: yargsA }) {
  return availableCommands.reduce(
    (yargsB, command) => addCommand({ yargs: yargsB, command }),
    yargsA,
  );
};

const addCommand = function ({ yargs: yargsA, command }) {
  const cliCommand = getCliCommand({ command });
  return yargsA.command(cliCommand);
};

const getCliCommand = function ({
  command,
  command: { name, aliases, description },
}) {
  return {
    command: name,
    aliases,
    describe: description,
    builder: yargsA => getBuilder({ command, yargs: yargsA }),
  };
};

// Iterate over command options
const getBuilder = function ({
  command,
  command: { description },
  yargs: yargsA,
}) {
  const yargsB = addCommandExamples({ command, yargs: yargsA });
  const cliOptions = getCliOptions({ command });
  return yargsB
    .options(cliOptions)
    // Command --help header
    .usage(description);
};

// Add examples in top-level --help
const addCommandsExamples = function ({ yargs: yargsA }) {
  return Object.values(availableCommands).reduce(
    (yargsB, command) =>
      addCommandExamples({ yargs: yargsB, command }),
    yargsA,
  );
};

// Add examples in command-level --help
const addCommandExamples = function ({
  command: { name, examples = [] },
  yargs: yargsA,
}) {
  return examples.reduce(
    (yargsB, [desc, usageA]) =>
      yargsB.example(`${desc}:`, `apiengine ${name} ${usageA}`),
    yargsA,
  );
};

module.exports = {
  addCommands,
  addCommandsExamples,
};
