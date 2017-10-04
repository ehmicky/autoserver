'use strict';

const { GraphQLInt, GraphQLString } = require('graphql');

const { pick } = require('../../../../../../../../../utilities');

// Pagination arguments
const paginationCommands = ['find', 'patch', 'delete'];
const fullPaginationCommands = ['find'];

const getPaginationArgument = function ({ command }) {
  // Only with commands that return an array and do not provide array of data,
  // i.e. only with findMany, deleteMany and patchMany
  if (!(paginationCommands.includes(command.type) && command.multiple)) {
    return {};
  }

  // Only with safe commands that return an array, i.e. only with findMany
  if (!(fullPaginationCommands.includes(command.type) && command.multiple)) {
    return pick(paginationArgs, 'page_size');
  }

  return paginationArgs;
};

const paginationArgs = {
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

  page_size: {
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
