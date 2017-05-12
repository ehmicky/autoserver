'use strict';


const { GraphQLInt, GraphQLString } = require('graphql');


// Pagination arguments
const paginationActionTypes = ['find', 'update', 'delete'];
const fullPaginationActionTypes = ['find'];
const getPaginationArgument = function ({ action: { actionType, multiple }, defaultPageSize, maxPageSize }) {
  // Only with operations that return an array and do not provide array of data, i.e. only with findMany, deleteMany and
  // updateMany
  if (!(paginationActionTypes.includes(actionType) && multiple)) { return; }

  const paginationArgs = {
    page_size: {
      type: GraphQLInt,
      description: `Sets pagination size.
  Using 0 disables pagination.
  Maximum: ${maxPageSize}`,
      defaultValue: defaultPageSize,
    }
  };

  // Only with safe operations that return an array, i.e. only with findMany
  if (!(fullPaginationActionTypes.includes(actionType) && multiple)) { return paginationArgs; }

  return Object.assign(paginationArgs, {
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
  });
};


module.exports = {
  getPaginationArgument,
};
