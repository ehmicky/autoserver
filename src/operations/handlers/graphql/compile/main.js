'use strict';

const { getSchema } = require('./schema');
const { printSchema } = require('./print');

// Add GraphQL schema, so it can be used by introspection, and by GraphQLPrint
const compileIdl = async function ({ models }) {
  const GraphQLSchema = await getSchema({ models });
  const GraphQLPrintedSchema = await printSchema({ GraphQLSchema });

  return { GraphQLPrintedSchema };
};

module.exports = {
  compileIdl,
};
