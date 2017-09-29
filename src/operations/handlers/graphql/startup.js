'use strict';

const { buildSchema } = require('graphql');

// Build GraphQL schema from textual representation
const startServer = function ({ GraphQLPrintedSchema }) {
  const GraphQLSchema = buildSchema(GraphQLPrintedSchema);

  return { GraphQLSchema };
};

module.exports = {
  startServer,
};
