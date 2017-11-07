'use strict';

const { GraphQLBoolean } = require('graphql');

// `dryrun` argument
const getDryrunArgument = function ({ command }) {
  const hasDryrun = DRYRUN_COMMANDS.includes(command.type);
  if (!hasDryrun) { return {}; }

  return DRYRUN_ARGS;
};

const DRYRUN_COMMANDS = ['create', 'upsert', 'patch', 'delete'];

const DRYRUN_ARGS = {
  dryrun: {
    type: GraphQLBoolean,
    description: 'No modification will be applied to the database, but the response will be the same as if it did.',
    defaultValue: false,
  },
};

module.exports = {
  getDryrunArgument,
};
