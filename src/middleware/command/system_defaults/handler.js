'use strict';

const { mapValues, pickBy } = require('../../../utilities');

const { defaults } = require('./defaults');

// Apply system-defined defaults to input, including input arguments
const systemDefaults = function ({ args, runOpts, command }) {
  const filteredDefaults = pickBy(
    defaults,
    (defaultConf, attrName) =>
      shouldDefault({ args, runOpts, command, defaultConf, attrName }),
  );

  const defaultArgs = mapValues(
    filteredDefaults,
    ({ value }) => applyDefault({ value, args, runOpts }),
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

  // Whitelist by command.name
  if (commands && !commands.includes(command.name)) { return false; }

  // Whitelist by tests
  if (testFunc && !testFunc({ args, runOpts })) { return false; }

  return true;
};

const applyDefault = function ({ value, args, runOpts }) {
  if (typeof value === 'function') {
    return value({ args, runOpts });
  }

  return value;
};

module.exports = {
  systemDefaults,
};
