'use strict';

const { buildSchema } = require('graphql');

// Build GraphQL schema from textual representation
const startServer = function ({ graphqlPrintedSchema }) {
  const graphqlSchema = buildSchema(graphqlPrintedSchema);

  return { graphqlSchema };
};

module.exports = {
  startServer,
};
