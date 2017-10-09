'use strict';

const { GraphQLSchema } = require('graphql');

const { getTopDefs } = require('./top_defs');
const { getTopTypes } = require('./type');

// Returns GraphQL schema
const getGraphQLSchema = function ({ models }) {
  const topDefs = getTopDefs({ models });
  const topTypes = getTopTypes({ topDefs });
  const graphQLSchema = new GraphQLSchema(topTypes);
  return graphQLSchema;
};

module.exports = {
  getGraphQLSchema,
};
