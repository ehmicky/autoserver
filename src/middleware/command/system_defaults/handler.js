'use strict';

const { mapValues, omitBy } = require('../../../utilities');

const { defaults } = require('./defaults');

// Apply system-defined defaults to input, including input arguments
const systemDefaults = async function (input) {
  const { serverOpts } = input;

  const nextArgs = getDefaultArgs({ serverOpts, input });
  Object.assign(input.args, nextArgs);

  const response = await this.next(input);
  return response;
};

// Retrieve default arguments
const getDefaultArgs = function ({
  serverOpts,
  input,
  input: { command, args },
}) {
  const filteredDefaults = omitBy(
    defaults,
    ({ commands, test: testFunc }, attrName) =>
      // Whitelist by command.name
      (commands && !commands.includes(command.name)) ||
      // Whitelist by tests
      (testFunc && !testFunc({ serverOpts, input })) ||
      // Only if user has not specified that argument
      args[attrName] !== undefined
  );

  // Reduce to a single object
  const defaultArgs = mapValues(filteredDefaults, ({ value }) =>
    (typeof value === 'function' ? value({ serverOpts, input }) : value)
  );

  return defaultArgs;
};

module.exports = {
  systemDefaults,
};
