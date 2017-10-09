'use strict';

const { buildSchema } = require('graphql');

// Build GraphQL schema from textual representation
const startServer = function ({ graphQLPrintedSchema }) {
  const graphQLSchema = buildSchema(graphQLPrintedSchema);

  return { graphQLSchema };
};

module.exports = {
  startServer,
};
