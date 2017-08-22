'use strict';

const { mapValues, pickBy } = require('../../../utilities');

const { defaults } = require('./defaults');

// Apply system-defined defaults to input, including input arguments
const systemDefaults = function (input) {
  const inputA = getDefaultArgs({ input });

  return inputA;
};

// Retrieve default arguments
const getDefaultArgs = function ({ input, input: { args } }) {
  const filteredDefaults = pickBy(
    defaults,
    (defaultConf, attrName) => shouldDefault({ input, defaultConf, attrName }),
  );

  const defaultArgs = mapValues(
    filteredDefaults,
    ({ value }) => applyDefault({ value, input }),
  );

  return { ...input, args: { ...args, ...defaultArgs } };
};

const shouldDefault = function ({
  input,
  input: { command, args },
  defaultConf: { commands, test: testFunc },
  attrName,
}) {
  // Only if user has not specified that argument
  if (args[attrName] != null) { return false; }

  // Whitelist by command.name
  if (commands && !commands.includes(command.name)) { return false; }

  // Whitelist by tests
  if (testFunc && !testFunc({ input })) { return false; }

  return true;
};

const applyDefault = function ({ value, input }) {
  if (typeof value === 'function') {
    return value({ input });
  }

  return value;
};

module.exports = {
  systemDefaults,
};
