'use strict';

const { getSchema } = require('./schema');
const { printSchema } = require('./print');

// Add GraphQL schema, both as AST and as HTML output
const normalizeGraphQL = async function ({ idl }) {
  const GraphQLSchema = await getSchema({ idl });
  const GraphQLPrintedSchema = await printSchema({ GraphQLSchema });

  return { ...idl, GraphQLPrintedSchema };
};

module.exports = {
  normalizeGraphQL,
};
