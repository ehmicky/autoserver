'use strict';

const { mapValues, pickBy, result } = require('../../../utilities');

const { defaults } = require('./defaults');

// Apply system-defined defaults to mInput, including arguments
const systemDefaults = function ({ args, runOpts, command }) {
  const filteredDefaults = pickBy(
    defaults,
    (defaultConf, attrName) =>
      shouldDefault({ args, runOpts, command, defaultConf, attrName }),
  );

  const defaultArgs = mapValues(
    filteredDefaults,
    ({ value }) => result(value, { args, runOpts }),
  );

  return { args: { ...args, ...defaultArgs } };
};

const shouldDefault = function ({
  args,
  runOpts,
  command,
  defaultConf: { commands, test: testFunc },
  attrName,
}) {
  // Only if user has not specified that argument
  if (args[attrName] != null) { return false; }

  // Whitelist by command
  if (commands && !commands.includes(command)) { return false; }

  // Whitelist by tests
  if (testFunc && !testFunc({ args, runOpts })) { return false; }

  return true;
};

module.exports = {
  systemDefaults,
};
