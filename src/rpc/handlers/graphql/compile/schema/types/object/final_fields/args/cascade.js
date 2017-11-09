'use strict';

const { GraphQLString } = require('graphql');

// `cascade` argument
const getCascadeArgument = function ({ command }) {
  const hasCascade = CASCADE_COMMANDS.includes(command);
  if (!hasCascade) { return {}; }

  return CASCADE_ARGS;
};

const CASCADE_COMMANDS = ['delete'];

const CASCADE_ARGS = {
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
