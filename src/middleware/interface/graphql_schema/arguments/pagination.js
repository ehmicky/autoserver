'use strict';


const { GraphQLInt, GraphQLString } = require('graphql');


// Pagination arguments
const paginationActionTypes = ['find'];
const getPaginationArgument = function ({ action: { actionType, multiple }, defaultPageSize, maxPageSize }) {
  // Only with safe operations that return an array, i.e. only with findMany
  if (!(paginationActionTypes.includes(actionType) && multiple)) { return; }

  return {
    page_size: {
      type: GraphQLInt,
      description: `Sets pagination size.
Using 0 disables pagination.
Maximum: ${maxPageSize}`,
      defaultValue: defaultPageSize,
    },

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
  };
};


module.exports = {
  getPaginationArgument,
};
