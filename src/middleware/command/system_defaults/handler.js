'use strict';


const { mapValues, omitBy } = require('../../../utilities');
const { defaults } = require('./defaults');


// Apply system-defined defaults to input, including input arguments
const systemDefaults = function () {
  return async function systemDefaults(input) {
    const { log, serverOpts } = input;
    const perf = log.perf.start('command.systemDefaults', 'middleware');

    const nextArgs = getDefaultArgs({ serverOpts, input });
    Object.assign(input.args, nextArgs);

    perf.stop();
    const response = await this.next(input);
    return response;
  };
};

// Retrieve default arguments
const getDefaultArgs = function ({
  serverOpts,
  input,
  input: { command, args },
}) {
  const filteredDefaults = omitBy(defaults, ({ commands, test }, attrName) =>
    // Whitelist by command.name
    (commands && !commands.includes(command.name)) ||
    // Whitelist by tests
    (test && !test({ serverOpts, input })) ||
    // Only if user has not specified that argument
    args[attrName] !== undefined
  );

  // Reduce to a single object
  const defaultArgs = mapValues(filteredDefaults, ({ value }) => {
    return typeof value === 'function' ? value({ serverOpts, input }) : value;
  });

  return defaultArgs;
};


module.exports = {
  systemDefaults,
};
