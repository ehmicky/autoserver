'use strict';

const { GraphQLBoolean } = require('graphql');

// `dryrun` argument
const getDryrunArgument = function ({ command }) {
  const hasDryrun = dryrunCommands.includes(command.type);
  if (!hasDryrun) { return {}; }

  return dryrunArgs;
};

const dryrunCommands = ['create', 'replace', 'patch', 'delete'];

const dryrunArgs = {
  dryrun: {
    type: GraphQLBoolean,
    description: 'No modification will be applied to the database, but the response will be the same as if it did.',
    defaultValue: false,
  },
};

module.exports = {
  getDryrunArgument,
};
