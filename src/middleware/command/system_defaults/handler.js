'use strict';


const { merge } = require('lodash');

const { defaults } = require('./defaults');


// Apply system-defined defaults to input, including input arguments
const systemDefaults = function (opts) {
  return async function systemDefaults(input) {
    const { log } = input;
    const perf = log.perf.start('systemDefaults', 'middleware');

    const newInput = getDefaultArgs({ opts, input });
    merge(input, newInput);

    perf.stop();
    const response = await this.next(input);
    return response;
  };
};

// Retrieve default arguments
const getDefaultArgs = function ({ opts, input }) {
  const { command } = input;
  // Iterate through every possible default value
  return Object.entries(defaults)
    .map(([name, defaultsValue]) => {
      defaultsValue = Object.entries(defaultsValue)
        // Whitelist by command.name
        .filter(([, { commandNames }]) => {
          return !commandNames || commandNames.includes(command.name);
        })
        // Whitelist by tests
        .filter(([, { test }]) => !test || test({ opts, input }))
        // Only if user has not specified that argument
        .filter(([attrName]) => input[name][attrName] === undefined)
        // Reduce to a single object
        .map(([attrName, { value }]) => {
          const val = typeof value === 'function'
            ? value({ opts, input })
            : value;
          return { [attrName]: val };
        })
        .reduce((memo, object) => Object.assign(memo, object), {});
      return { [name]: defaultsValue };
    })
    .reduce((memo, object) => Object.assign(memo, object), {});
};


module.exports = {
  systemDefaults,
};
