'use strict';

const { GraphQLSchema } = require('graphql');

const { getTopDefs } = require('./top_defs');
const { getTopTypes } = require('./type');

// Returns GraphQL schema
const getGraphqlSchema = function ({ collections }) {
  const topDefs = getTopDefs({ collections });
  const topTypes = getTopTypes({ topDefs });
  const graphqlSchema = new GraphQLSchema(topTypes);
  return graphqlSchema;
};

module.exports = {
  getGraphqlSchema,
};
