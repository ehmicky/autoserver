'use strict';

const { GraphQLSchema } = require('graphql');

const { getTopDefs } = require('./top_defs');
const { getTopTypes } = require('./type');

// Returns GraphQL schema
const getGraphqlSchema = function ({ models, allowedCommandsMap }) {
  const topDefs = getTopDefs({ models });
  const topTypes = getTopTypes({ topDefs, allowedCommandsMap });
  const graphqlSchema = new GraphQLSchema(topTypes);
  return graphqlSchema;
};

module.exports = {
  getGraphqlSchema,
};
