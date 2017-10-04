'use strict';

const { GraphQLBoolean } = require('graphql');

// `dryrun` argument
const getDryRunArgument = function ({ command }) {
  const hasDryRun = dryRunCommands.includes(command.type);
  if (!hasDryRun) { return {}; }

  return dryRunArgs;
};

const dryRunCommands = ['create', 'replace', 'patch', 'delete'];

const dryRunArgs = {
  dryrun: {
    type: GraphQLBoolean,
    description: 'No modification will be applied to the database, but the response will be the same as if it did.',
    defaultValue: false,
  },
};

module.exports = {
  getDryRunArgument,
};
