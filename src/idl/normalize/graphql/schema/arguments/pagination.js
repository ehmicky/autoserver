'use strict';

const { GraphQLInt, GraphQLString } = require('graphql');

// Pagination arguments
const paginationActions = ['find', 'update', 'delete'];
const fullPaginationActions = ['find'];

const getPaginationArgument = function ({
  action,
  defaultPageSize,
  maxPageSize,
}) {
  // Only with actions that return an array and do not provide array of data,
  // i.e. only with findMany, deleteMany and
  // updateMany
  if (!(paginationActions.includes(action.type) && action.multiple)) {
    return {};
  }

  const pageSizeArg = getPageSizeArg({ maxPageSize, defaultPageSize });

  // Only with safe actions that return an array, i.e. only with findMany
  if (!(fullPaginationActions.includes(action.type) && action.multiple)) {
    return pageSizeArg;
  }

  return { ...pageSizeArg, ...paginationArgs };
};

const getPageSizeArg = ({ maxPageSize, defaultPageSize }) => ({
  page_size: {
    type: GraphQLInt,
    description: `Sets pagination size.
Using 0 disables pagination.
Maximum: ${maxPageSize}`,
    defaultValue: defaultPageSize,
  },
});

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
