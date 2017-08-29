'use strict';

const { buildSchema } = require('graphql');

// Build GraphQL schema from textual representation
const buildGraphQLSchema = function ({ idl, idl: { GraphQLPrintedSchema } }) {
  const GraphQLSchema = buildSchema(GraphQLPrintedSchema);

  return { idl: { ...idl, GraphQLSchema } };
};

module.exports = {
  buildGraphQLSchema,
};
