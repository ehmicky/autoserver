'use strict';

const { monitor } = require('../../../perf');

const { getSchema } = require('./schema');
const { printSchema } = require('./print');

// Add GraphQL schema, both as AST and as HTML output
const normalizeGraphQL = async function ({ idl }) {
  const [GraphQLSchema, getMeasure] = await monitoredGetSchema({ idl });
  const [GraphQLPrintedSchema, printMeasure] = await monitoredPrintSchema({
    schema: GraphQLSchema,
  });

  const idlA = { ...idl, GraphQLSchema, GraphQLPrintedSchema };
  const measures = [getMeasure, printMeasure];
  return [idlA, measures];
};

const monitoredGetSchema = monitor(getSchema, 'schema', 'graphql');
const monitoredPrintSchema = monitor(printSchema, 'print', 'graphql');

module.exports = {
  normalizeGraphQL,
};
