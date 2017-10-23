'use strict';

const { GraphQLBoolean } = require('graphql');

// `silent` argument
const getSilentArgument = function () {
  return SILENT_ARGS;
};

const SILENT_ARGS = {
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
