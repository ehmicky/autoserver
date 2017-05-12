'use strict';


const { defaults } = require('./defaults');


// Apply system-defined defaults to input, including input arguments
const systemDefaults = async function (opts) {
  return async function systemDefaults(input) {
    const { args } = input;

    const defaultArgs = getDefaultArgs({ opts, input });
    Object.assign(args, defaultArgs);

    const response = await this.next(input);
    return response;
  };
};

// Retrieve default arguments
const getDefaultArgs = function ({ opts, input: { args, action } }) {
  // Iterate through every possible default argument
  return Object.entries(defaults)
    // Whitelist by action
    .filter(([, { actions }]) => actions.includes(action))
    // Whitelist by tests
    .filter(([, { test }]) => !test || test({ opts, args }))
    // Only if user has not specified that argument
    .filter(([attrName]) => args[attrName] === undefined)
    // Reduce to a single object
    .map(([attrName, { value }]) => {
      const val = typeof value === 'function' ? value({ opts, args }) : value;
      return { [attrName]: val };
    })
    .reduce((memo, object) => Object.assign(memo, object), {});
};


module.exports = {
  systemDefaults,
};
