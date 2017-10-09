'use strict';

const { getGraphQLSchema } = require('./schema');
const { printGraphQLSchema } = require('./print');

// Add GraphQL schema, so it can be used by introspection, and by GraphQLPrint
const compileSchema = async function ({ models }) {
  const graphQLSchema = await getGraphQLSchema({ models });
  const graphQLPrintedSchema = await printGraphQLSchema({ graphQLSchema });

  return { graphQLPrintedSchema };
};

module.exports = {
  compileSchema,
};
