'use strict';

const { monitor } = require('../../../perf');

const { getSchema } = require('./schema');
const { printSchema } = require('./print');

// Add GraphQL schema, both as AST and as HTML output
const normalizeGraphQL = async function ({ idl, serverOpts }) {
  const [GraphQLSchema, getMeasure] = await monitoredGetSchema({
    idl,
    serverOpts,
  });
  const [GraphQLPrintedSchema, printMeasure] = await monitoredPrintSchema({
    schema: GraphQLSchema,
  });

  const newIdl = Object.assign({}, idl, {
    GraphQLSchema,
    GraphQLPrintedSchema,
  });
  const measures = [getMeasure, printMeasure];
  return [newIdl, measures];
};

const monitoredGetSchema = monitor(getSchema, 'schema', 'graphql');
const monitoredPrintSchema = monitor(printSchema, 'print', 'graphql');

module.exports = {
  normalizeGraphQL,
};
