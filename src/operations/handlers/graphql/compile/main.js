'use strict';

const { getSchema } = require('./schema');
const { printSchema } = require('./print');

// Add GraphQL schema, so it can be used by introspection, and by GraphQLPrint
const compileIdl = async function ({ idl }) {
  const GraphQLSchema = await getSchema({ idl });
  const GraphQLPrintedSchema = await printSchema({ GraphQLSchema });

  return { ...idl, GraphQLPrintedSchema };
};

module.exports = {
  compileIdl,
};
