'use strict';

const { GraphQLInt, GraphQLString } = require('graphql');

const { pick, omit } = require('../../../../../../../../../utilities');

// Pagination arguments
const getPaginationArgument = function ({ command, features }) {
  // Only with commands that return an array and do not provide array of data,
  // i.e. only with findMany, deleteMany and patchMany
  const hasPaginationArgs = PAGINATION_COMMANDS.includes(command.type) &&
    command.multiple;

  if (!hasPaginationArgs) {
    return {};
  }

  // Only with safe commands that return an array, i.e. only with findMany
  const hasFullArgs = FULL_PAGINATION_COMMANDS.includes(command.type) &&
    command.multiple;

  if (!hasFullArgs) {
    return pick(PAGINATION_ARGS, 'pagesize');
  }

  if (!features.includes('offset')) {
    return omit(PAGINATION_ARGS, 'page');
  }

  return PAGINATION_ARGS;
};

const PAGINATION_COMMANDS = ['find', 'patch', 'delete'];
const FULL_PAGINATION_COMMANDS = ['find'];

const PAGINATION_ARGS = {
  after: {
    type: GraphQLString,
    description: `Retrieves next pagination batch, using the previous response's last model's 'token'.
Using '' means 'from the beginning'`,
    defaultValue: '',
  },

  before: {
    type: GraphQLString,
    description: `Retrieves previous pagination batch, using the previous response's first model's 'token'.
Using '' means 'from the end'`,
  },

  pagesize: {
    type: GraphQLInt,
    description: `Sets pagination size.
Using 0 disables pagination.`,
  },

  page: {
    type: GraphQLInt,
    description: `Page number, for pagination.
Starts at 1.
Cannot be used with 'before' or 'after'`,
  },
};

module.exports = {
  getPaginationArgument,
};
