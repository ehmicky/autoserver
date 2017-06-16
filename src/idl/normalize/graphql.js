'use strict';


const { getSchema } = require('./graphql_schema');
const { printSchema } = require('./graphql_print');

// Add GraphQL schema, both as AST and as HTML output
const normalizeGraphQL = async function ({ idl, serverOpts, startupLog }) {
  const schemaPerf = startupLog.perf.start('schema', 'graphql');
  const GraphQLSchema = getSchema({ idl, serverOpts });
  schemaPerf.stop();

  const printPerf = startupLog.perf.start('print', 'graphql');
  const GraphQLPrintedSchema = await printSchema({ schema: GraphQLSchema });
  printPerf.stop();

  Object.assign(idl, { GraphQLSchema, GraphQLPrintedSchema });
  return idl;
};


module.exports = {
  normalizeGraphQL,
};
