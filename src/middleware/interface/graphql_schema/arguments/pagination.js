'use strict';


const { GraphQLInt, GraphQLString, GraphQLBoolean } = require('graphql');


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
      description: 'Retrieves next pagination batch, using the previous response\'s \'next_token\'',
    },

    before: {
      type: GraphQLString,
      description: 'Retrieves previous pagination batch, using the previous response\'s \'previous_token\'',
    },

    pagination_info: {
      type: GraphQLBoolean,
      description: `Adds extra pagination information in the output, related to the first page, the last page and the total response size.
This will slightly slow down the request.`,
      defaultValue: false,
    },
  };
};


module.exports = {
  getPaginationArgument,
};
