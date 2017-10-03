'use strict';

const { GraphQLString } = require('graphql');

// `cascade` argument
const getCascadeArgument = function ({ def: { command } }) {
  const hasCascade = cascadeCommands.includes(command.type);
  if (!hasCascade) { return {}; }

  return cascadeArgs;
};

const cascadeCommands = ['delete'];

const cascadeArgs = {
  cascade: {
    type: GraphQLString,
    description: `Also delete specified nested models.
Each attribute can use dot-delimited notation to specify deeply nested models.
Several attributes can specified, by using a comma-separated list.`,
  },
};

module.exports = {
  getCascadeArgument,
};
