'use strict';

const { getGraphqlSchema } = require('./schema');
const { printGraphqlSchema } = require('./print');

// Add GraphQL schema, so it can be used by introspection, and by graphqlPrint
const compileSchema = async function ({ models }) {
  const graphqlSchema = await getGraphqlSchema({ models });
  const graphqlPrintedSchema = await printGraphqlSchema({ graphqlSchema });

  return { graphqlPrintedSchema };
};

module.exports = {
  compileSchema,
};
