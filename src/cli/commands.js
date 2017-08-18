'use strict';

const { availableOptions } = require('../options');

const { getCliOptions } = require('./options');

// Iterate over `availableOptions` to add all commands
const addCommands = function ({ yargs: yargsA }) {
  return availableOptions.reduce(
    (yargsB, availableOpts) => addCommand({ yargs: yargsB, availableOpts }),
    yargsA,
  );
};

const addCommand = function ({ yargs: yargsA, availableOpts }) {
  const command = getCommand({ availableOpts });
  return yargsA.command(command);
};

const getCommand = function ({
  availableOpts,
  availableOpts: { name, aliases, description },
}) {
  return {
    command: name,
    aliases,
    describe: description,
    builder: yargsA => getBuilder({ availableOpts, yargs: yargsA }),
  };
};

// Iterate over command options
const getBuilder = function ({
  availableOpts,
  availableOpts: { description },
  yargs: yargsA,
}) {
  const yargsB = addCommandExamples({ availableOpts, yargs: yargsA });
  const cliOptions = getCliOptions({ availableOpts });
  return yargsB
    .options(cliOptions)
    // Command --help header
    .usage(description);
};

// Add examples in top-level --help
const addCommandsExamples = function ({ yargs: yargsA }) {
  return Object.values(availableOptions).reduce(
    (yargsB, availableOpts) =>
      addCommandExamples({ yargs: yargsB, availableOpts }),
    yargsA,
  );
};

// Add examples in command-level --help
const addCommandExamples = function ({
  availableOpts: { examples = [] },
  yargs: yargsA,
}) {
  return examples.reduce(
    (yargsB, [desc, usageA]) =>
      yargsB.example(`${desc}:`, `apiengine ${usageA}`),
    yargsA,
  );
};

module.exports = {
  addCommands,
  addCommandsExamples,
};
