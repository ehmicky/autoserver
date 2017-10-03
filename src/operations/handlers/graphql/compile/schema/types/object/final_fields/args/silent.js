'use strict';

const { GraphQLBoolean } = require('graphql');

// `silent` argument
const getSilentArgument = function () {
  return silentArgs;
};

const silentArgs = {
  silent: {
    type: GraphQLBoolean,
    description: `Do not output any result.
The action is still performed.`,
    defaultValue: false,
  },
};

module.exports = {
  getSilentArgument,
};
