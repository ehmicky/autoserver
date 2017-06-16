'use strict';


const { getSchema } = require('./graphql_schema');
const { printSchema } = require('./graphql_print');

// Add GraphQL schema, both as AST and as HTML output
const normalizeGraphQL = async function ({ idl, serverOpts }) {
  const GraphQLSchema = getSchema({ idl, serverOpts });
  const GraphQLPrintedSchema = await printSchema({ schema: GraphQLSchema });

  Object.assign(idl, { GraphQLSchema, GraphQLPrintedSchema });
  return idl;
};


module.exports = {
  normalizeGraphQL,
};
